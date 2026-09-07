import type {
  CardFamily,
  DeviceId,
  ObjectiveSpec,
  PlacedCard,
  SocietyKind,
  TimelineAction,
  TimelineBranch,
  TimelineCardDefinition,
  TimelineConfig,
  TimelineDeviceDefinition,
  TimelineNode,
  TimelineState,
} from "./types.js";

export type {
  BuiltDevice,
  CardFamily,
  DeviceId,
  DeviceRequirements,
  EventKind,
  InventionKind,
  ObjectiveSpec,
  PlacedCard,
  PlayerMat,
  PlayerObjective,
  RandomEventKind,
  ResourceKind,
  SocietyKind,
  TimelineAction,
  TimelineBranch,
  TimelineCardDefinition,
  TimelineConfig,
  TimelineDeck,
  TimelineDeviceDefinition,
  TimelineNode,
  TimelineState,
  TimelineStatus,
} from "./types.js";

const LOG_LIMIT = 12;

export function cardById(
  config: TimelineConfig,
  cardId: string,
): TimelineCardDefinition | undefined {
  return config.cards.find((c) => c.id === cardId);
}

export function isActionCard(
  def: TimelineCardDefinition | undefined,
): boolean {
  return Boolean(def && def.family !== "random-event");
}

export function deviceById(
  config: TimelineConfig,
  deviceId: DeviceId,
): TimelineDeviceDefinition | undefined {
  return config.devices.find((d) => d.id === deviceId);
}

function alloc(state: TimelineState, prefix: string): {
  id: string;
  nextId: number;
} {
  return { id: `${prefix}${state.nextId}`, nextId: state.nextId + 1 };
}

function log(state: TimelineState, message: string): TimelineState {
  return { ...state, log: [...state.log, message].slice(-LOG_LIMIT) };
}

function clamp(n: number, min = 0): number {
  return Math.max(min, n);
}

function nextRand(state: TimelineState): { value: number; state: TimelineState } {
  const rngSeed = (Math.imul(state.rngSeed, 1664525) + 1013904223) >>> 0;
  return { value: rngSeed / 0x100000000, state: { ...state, rngSeed } };
}

function roll13(state: TimelineState): { roll: number; state: TimelineState } {
  const r = nextRand(state);
  return { roll: 1 + Math.floor(r.value * 3), state: r.state };
}

function shuffle(
  ids: string[],
  state: TimelineState,
): { ids: string[]; state: TimelineState } {
  const out = [...ids];
  let current = state;
  for (let i = out.length - 1; i > 0; i -= 1) {
    const r = nextRand(current);
    current = r.state;
    const j = Math.floor(r.value * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return { ids: out, state: current };
}

function deckForFamily(family: CardFamily): "action" | "random" {
  return family === "random-event" ? "random" : "action";
}

function returnCard(
  state: TimelineState,
  cardId: string,
  family: CardFamily,
): TimelineState {
  if (family === "random-event") {
    return { ...state, randomDeck: [...state.randomDeck, cardId] };
  }
  return { ...state, actionDeck: [...state.actionDeck, cardId] };
}

export function getNode(state: TimelineState, id: string): TimelineNode {
  const node = state.nodes[id];
  if (!node) throw new Error(`Unknown timeline node ${id}`);
  return node;
}

export function getBranch(state: TimelineState, id: string): TimelineBranch {
  const branch = state.branches[id];
  if (!branch) throw new Error(`Unknown timeline branch ${id}`);
  return branch;
}

export function isHead(state: TimelineState, nodeId: string): boolean {
  const node = getNode(state, nodeId);
  return getBranch(state, node.branchId).headNodeId === nodeId;
}

export function isPrimary(state: TimelineState, branchId: string): boolean {
  return branchId === state.primaryBranchId;
}

export function isBranchEntry(state: TimelineState, nodeId: string): boolean {
  const node = getNode(state, nodeId);
  if (node.parentIds.length === 0) return true;
  return node.parentIds.some(
    (parentId) => getNode(state, parentId).branchId !== node.branchId,
  );
}

export function ancestorIds(state: TimelineState, nodeId: string): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  const walk = (id: string) => {
    for (const parentId of getNode(state, id).parentIds) {
      if (seen.has(parentId)) continue;
      seen.add(parentId);
      out.push(parentId);
      walk(parentId);
    }
  };
  walk(nodeId);
  return out;
}

export function isAncestor(
  state: TimelineState,
  maybeAncestorId: string,
  nodeId: string,
): boolean {
  return ancestorIds(state, nodeId).includes(maybeAncestorId);
}

export function pathFromEpoch(state: TimelineState, nodeId: string): string[] {
  const chain: string[] = [];
  const seen = new Set<string>();
  let current: string | null = nodeId;
  while (current && !seen.has(current)) {
    seen.add(current);
    chain.push(current);
    const node = getNode(state, current);
    const parents: string[] = node.parentIds;
    current = parents[0] ?? null;
  }
  return chain.reverse();
}

export function pathCardCount(state: TimelineState, nodeId: string): number {
  return pathFromEpoch(state, nodeId).filter((id) => getNode(state, id).card)
    .length;
}

export function branchLength(state: TimelineState, branchId: string): number {
  return Object.values(state.nodes).filter(
    (n) => n.branchId === branchId && n.card,
  ).length;
}

export function societyOnPath(
  state: TimelineState,
  config: TimelineConfig,
  nodeId: string,
): Record<SocietyKind, number> {
  const totals: Record<SocietyKind, number> = {
    culture: 0,
    science: 0,
    politics: 0,
  };
  for (const id of pathFromEpoch(state, nodeId)) {
    const placed = getNode(state, id).card;
    if (!placed) continue;
    const def = cardById(config, placed.cardId);
    if (def?.family === "society" && def.societyKind) {
      totals[def.societyKind] += def.societyValue ?? 1;
    }
  }
  return totals;
}

export function societyOnBranch(
  state: TimelineState,
  config: TimelineConfig,
  branchId: string,
): Record<SocietyKind, number> {
  const totals: Record<SocietyKind, number> = {
    culture: 0,
    science: 0,
    politics: 0,
  };
  for (const node of Object.values(state.nodes)) {
    if (node.branchId !== branchId || !node.card) continue;
    const def = cardById(config, node.card.cardId);
    if (def?.family === "society" && def.societyKind) {
      totals[def.societyKind] += def.societyValue ?? 1;
    }
  }
  return totals;
}

function inventionProduct(
  state: TimelineState,
  config: TimelineConfig,
  nodeId: string,
  kind: "education" | "infrastructure",
): number {
  let product = 1;
  const path = pathFromEpoch(state, nodeId);
  for (const id of path.slice(0, -1)) {
    const placed = getNode(state, id).card;
    if (!placed) continue;
    const def = cardById(config, placed.cardId);
    if (def?.family === "invention" && def.inventionKind === kind) {
      product *= def.inventionMultiplier ?? 2;
    }
  }
  return product;
}

export function nextAlongBranch(
  state: TimelineState,
  nodeId: string,
): string | null {
  const node = getNode(state, nodeId);
  const same = node.childIds.find(
    (id) => getNode(state, id).branchId === node.branchId,
  );
  if (same) return same;
  return node.childIds[0] ?? null;
}

export function previousAlongPath(
  state: TimelineState,
  nodeId: string,
): string | null {
  return getNode(state, nodeId).parentIds[0] ?? null;
}

export function jumperTargets(
  state: TimelineState,
  config: TimelineConfig,
  fromNodeId = state.travelerNodeId,
): string[] {
  const limit = config.jumpSteps ?? 3;
  const out: string[] = [];
  let current = fromNodeId;
  for (let i = 0; i < limit; i += 1) {
    const next = nextAlongBranch(state, current);
    if (!next) break;
    out.push(next);
    current = next;
  }
  return out;
}

export function descendantIds(
  state: TimelineState,
  rootId: string,
): Set<string> {
  const out = new Set<string>();
  const stack = [...getNode(state, rootId).childIds];
  while (stack.length > 0) {
    const id = stack.pop()!;
    if (out.has(id)) continue;
    out.add(id);
    stack.push(...getNode(state, id).childIds);
  }
  return out;
}

export function pathHasTrio(
  state: TimelineState,
  headNodeId: string,
  spec: ObjectiveSpec,
): boolean {
  const ids = new Set(
    pathFromEpoch(state, headNodeId)
      .map((id) => getNode(state, id).card?.cardId)
      .filter((id): id is string => Boolean(id)),
  );
  return (
    ids.has(spec.personId) && ids.has(spec.placeId) && ids.has(spec.thingId)
  );
}

export function objectiveIsPresent(
  state: TimelineState,
  spec: ObjectiveSpec,
): boolean {
  return Object.values(state.branches).some((branch) =>
    pathHasTrio(state, branch.headNodeId, spec),
  );
}

function recomputeDepths(state: TimelineState): TimelineState {
  const nodes = { ...state.nodes };
  const queue = [state.epochNodeId];
  const seen = new Set<string>();
  nodes[state.epochNodeId] = { ...nodes[state.epochNodeId], depth: 0 };
  seen.add(state.epochNodeId);
  while (queue.length > 0) {
    const id = queue.shift()!;
    const node = nodes[id];
    for (const childId of node.childIds) {
      const child = nodes[childId];
      const depth =
        Math.max(
          ...child.parentIds.map((parentId) => nodes[parentId].depth),
        ) + 1;
      nodes[childId] = { ...child, depth };
      if (!seen.has(childId)) {
        seen.add(childId);
        queue.push(childId);
      }
    }
  }
  return { ...state, nodes };
}

function newCardInstance(
  state: TimelineState,
  cardId: string,
): { card: PlacedCard; state: TimelineState } {
  const allocated = alloc(state, "c");
  return {
    card: { instanceId: allocated.id, cardId },
    state: { ...state, nextId: allocated.nextId },
  };
}

function appendChild(
  state: TimelineState,
  parentId: string,
  branchId: string,
  card: PlacedCard | null,
): { node: TimelineNode; state: TimelineState } {
  const parent = getNode(state, parentId);
  const allocated = alloc(state, "n");
  const node: TimelineNode = {
    id: allocated.id,
    branchId,
    depth: parent.depth + 1,
    parentIds: [parentId],
    childIds: [],
    card,
    revealed: true,
  };
  const parentNext: TimelineNode = {
    ...parent,
    childIds: [...parent.childIds, node.id],
  };
  const branch = getBranch(state, branchId);
  return {
    node,
    state: {
      ...state,
      nextId: allocated.nextId,
      nodes: {
        ...state.nodes,
        [parentId]: parentNext,
        [node.id]: node,
      },
      branches: {
        ...state.branches,
        [branchId]: { ...branch, headNodeId: node.id },
      },
    },
  };
}

function createFork(
  state: TimelineState,
  fromNodeId: string,
  card: PlacedCard,
): { node: TimelineNode; branch: TimelineBranch; state: TimelineState } {
  const from = getNode(state, fromNodeId);
  const branchAlloc = alloc(state, "b");
  const nodeAlloc = {
    id: `n${branchAlloc.nextId}`,
    nextId: branchAlloc.nextId + 1,
  };
  const index =
    Math.max(...Object.values(state.branches).map((b) => b.index)) + 1;
  const node: TimelineNode = {
    id: nodeAlloc.id,
    branchId: branchAlloc.id,
    depth: from.depth + 1,
    parentIds: [fromNodeId],
    childIds: [],
    card,
    revealed: true,
  };
  const branch: TimelineBranch = {
    id: branchAlloc.id,
    index,
    label: `Branch ${index}`,
    headNodeId: node.id,
    rootNodeId: node.id,
    parentBranchId: from.branchId,
    forkNodeId: fromNodeId,
    crystals: 1,
    preserved: false,
  };
  const parent = {
    ...from,
    childIds: [...from.childIds, node.id],
  };
  return {
    node,
    branch,
    state: {
      ...state,
      nextId: nodeAlloc.nextId,
      nodes: { ...state.nodes, [fromNodeId]: parent, [node.id]: node },
      branches: { ...state.branches, [branch.id]: branch },
      player: {
        ...state.player,
        crystals: state.player.crystals + 1,
      },
    },
  };
}

function resolveArrival(
  state: TimelineState,
  config: TimelineConfig,
  nodeId: string,
): TimelineState {
  const node = getNode(state, nodeId);
  const placed = node.card;
  if (!placed) {
    return log(
      state,
      `Arrived at an empty moment on ${getBranch(state, node.branchId).label}.`,
    );
  }
  const def = cardById(config, placed.cardId);
  if (!def) return log(state, `Unknown card ${placed.cardId}.`);

  if (def.family === "resource" && def.resourceKind) {
    const rolled = roll13(state);
    const kind =
      def.resourceKind === "parts" ? "education" : "infrastructure";
    const mult = inventionProduct(rolled.state, config, nodeId, kind);
    const gain = rolled.roll * mult;
    const resource = def.resourceKind;
    return log(
      {
        ...rolled.state,
        player: {
          ...rolled.state.player,
          [resource]: rolled.state.player[resource] + gain,
        },
      },
      `Gained ${gain} ${resource} (${rolled.roll}×${mult}).`,
    );
  }

  if (def.family === "random-draw") {
    if (state.randomDeck.length === 0) {
      return log(state, "Random event deck is empty.");
    }
    const drawn = state.randomDeck[0];
    const rest = state.randomDeck.slice(1);
    const event = cardById(config, drawn);
    return log(
      { ...state, randomDeck: rest },
      `Random event: ${event?.label ?? drawn}.`,
    );
  }

  if (def.family === "random-event") {
    if (def.randomKind === "negative") {
      const next = {
        ...state,
        player: {
          ...state.player,
          parts: clamp(state.player.parts - 1),
          minerals: clamp(state.player.minerals - 1),
        },
      };
      return log(next, `${def.label}: lost 1 part and 1 mineral.`);
    }
    if (def.randomKind === "positive") {
      const next = {
        ...state,
        player: {
          ...state.player,
          parts: state.player.parts + 2,
          minerals: state.player.minerals + 2,
        },
      };
      return log(next, `${def.label}: gained 2 parts and 2 minerals.`);
    }
    if (def.randomKind === "transport") {
      return log(
        { ...state, travelerNodeId: state.epochNodeId },
        `${def.label}: thrown back to epoch.`,
      );
    }
    if (def.randomKind === "shift") {
      const back = previousAlongPath(state, state.travelerNodeId);
      if (back) {
        return log(
          { ...state, travelerNodeId: back },
          `${def.label}: slipped backward.`,
        );
      }
    }
    return log(state, `${def.label} resolves.`);
  }

  if (def.family === "event") {
    return log(state, `Event: ${def.label} (${def.eventKind}).`);
  }
  if (def.family === "society") {
    return log(
      state,
      `Society +${def.societyValue ?? 1} ${def.societyKind} on ${getBranch(state, node.branchId).label}.`,
    );
  }
  if (def.family === "invention") {
    return log(
      state,
      `${def.label} now multiplies future ${def.inventionKind === "education" ? "parts" : "minerals"}.`,
    );
  }
  if (def.family === "blueprint" && def.deviceId) {
    const next = {
      ...state,
      player: {
        ...state.player,
        blueprints: state.player.blueprints.includes(def.deviceId)
          ? state.player.blueprints
          : [...state.player.blueprints, def.deviceId],
      },
    };
    return log(next, `Blueprint for ${def.label} filed on the player mat.`);
  }
  return log(state, `Resolved ${def.label}.`);
}

function moveTraveler(
  state: TimelineState,
  config: TimelineConfig,
  nodeId: string,
  opts: { resolve: boolean },
): TimelineState {
  getNode(state, nodeId);
  let next: TimelineState = { ...state, travelerNodeId: nodeId };
  if (opts.resolve) {
    next = resolveArrival(next, config, nodeId);
  }
  const maxPath = config.maxPathLength ?? 20;
  if (!next.debugMode && pathCardCount(next, nodeId) >= maxPath) {
    next = {
      ...next,
      status: "endOfTime",
      player: { ...next.player, crystals: next.player.crystals + 2 },
    };
    next = log(next, "End of time. Gained 2 crystals. Turn over.");
  }
  return next;
}

function manipulationBlocked(
  state: TimelineState,
  branchId: string,
): string | null {
  if (state.debugMode) return null;
  if (getBranch(state, branchId).preserved) {
    return `${getBranch(state, branchId).label} is preserved.`;
  }
  return null;
}

export function createInitialTimeline(
  config: TimelineConfig,
  rngSeed = 1,
): TimelineState {
  const epochId = "n0";
  const primaryId = "b1";
  const epoch: TimelineNode = {
    id: epochId,
    branchId: primaryId,
    depth: 0,
    parentIds: [],
    childIds: [],
    card: null,
    revealed: true,
  };
  const primary: TimelineBranch = {
    id: primaryId,
    index: 1,
    label: "Prime",
    headNodeId: epochId,
    rootNodeId: epochId,
    parentBranchId: null,
    forkNodeId: null,
    crystals: 0,
    preserved: false,
  };

  let state: TimelineState = {
    nodes: { [epochId]: epoch },
    branches: { [primaryId]: primary },
    epochNodeId: epochId,
    primaryBranchId: primaryId,
    travelerNodeId: epochId,
    hand: [],
    actionDeck: [],
    randomDeck: [],
    player: {
      parts: config.startingResources?.parts ?? 0,
      minerals: config.startingResources?.minerals ?? 0,
      crystals: config.startingResources?.crystals ?? 0,
      devices: [],
      blueprints: [],
      objectives: (config.objectives ?? []).map((o) => ({
        ...o,
        complete: false,
      })),
      pendingClaimIds: [],
      completedCount: 0,
    },
    debugMode: config.debugMode !== false,
    status: "playing",
    log: ["Epoch. The timestream is quiet."],
    nextId: 2,
    rngSeed,
  };

  const used = new Set<string>(config.seedCardIds ?? []);
  let cursor = epochId;
  for (const cardId of config.seedCardIds ?? []) {
    const made = newCardInstance(state, cardId);
    const appended = appendChild(made.state, cursor, primaryId, made.card);
    state = appended.state;
    cursor = appended.node.id;
  }

  const actionIds = config.cards
    .filter((c) => deckForFamily(c.family) === "action" && !used.has(c.id))
    .map((c) => c.id);
  const randomIds = config.cards
    .filter((c) => deckForFamily(c.family) === "random" && !used.has(c.id))
    .map((c) => c.id);
  const shuffledAction = shuffle(actionIds, state);
  const shuffledRandom = shuffle(randomIds, shuffledAction.state);
  state = {
    ...shuffledRandom.state,
    actionDeck: shuffledAction.ids,
    randomDeck: shuffledRandom.ids,
  };

  for (const cardId of config.startingHand ?? []) {
    const made = newCardInstance(state, cardId);
    state = { ...made.state, hand: [...made.state.hand, made.card] };
  }

  if ((config.seedCardIds ?? []).length > 0) {
    state = log(state, "A seeded past lies ahead of epoch.");
  }
  return state;
}

function drawFrom(
  state: TimelineState,
  config: TimelineConfig,
  deck: "action" | "random",
): TimelineState {
  const pile = deck === "action" ? state.actionDeck : state.randomDeck;
  if (pile.length === 0) {
    return log(state, `The ${deck} deck is empty.`);
  }
  const cardId = pile[0];
  const rest = pile.slice(1);
  const made = newCardInstance(
    deck === "action"
      ? { ...state, actionDeck: rest }
      : { ...state, randomDeck: rest },
    cardId,
  );
  const maxHand = config.maxHand ?? 7;
  if (!made.state.debugMode && made.state.hand.length >= maxHand) {
    return log(state, `Hand is full (${maxHand}).`);
  }
  const def = cardById(config, cardId);
  return log(
    { ...made.state, hand: [...made.state.hand, made.card] },
    `Drew ${def?.label ?? cardId}.`,
  );
}

function playCard(
  state: TimelineState,
  config: TimelineConfig,
  instanceId: string,
  atNodeId: string,
): TimelineState {
  const held = state.hand.find((c) => c.instanceId === instanceId);
  if (!held) return log(state, "That card is not in hand.");
  getNode(state, atNodeId);
  const def = cardById(config, held.cardId);
  const without = {
    ...state,
    hand: state.hand.filter((c) => c.instanceId !== instanceId),
  };

  const head = isHead(without, atNodeId);
  let placed: { node: TimelineNode; state: TimelineState };
  if (head) {
    const branchId = getNode(without, atNodeId).branchId;
    if (
      !without.debugMode &&
      isPrimary(without, branchId) &&
      branchLength(without, without.primaryBranchId) >=
        (config.maxPrimaryLength ?? 20)
    ) {
      return log(state, "Prime cannot grow past 20 cards.");
    }
    if (
      !without.debugMode &&
      !isPrimary(without, branchId) &&
      branchLength(without, branchId) >= (config.maxBranchLength ?? 10)
    ) {
      return log(state, "This branch cannot grow past 10 cards.");
    }
    placed = appendChild(without, atNodeId, branchId, held);
  } else {
    if (
      !without.debugMode &&
      Object.keys(without.branches).length >= (config.maxBranches ?? 12)
    ) {
      return log(state, "No more than 12 branches.");
    }
    const forked = createFork(without, atNodeId, held);
    placed = { node: forked.node, state: forked.state };
    placed.state = log(
      placed.state,
      `Forked ${forked.branch.label} and gained a crystal.`,
    );
  }

  let next = moveTraveler(placed.state, config, placed.node.id, {
    resolve: false,
  });
  next = resolveArrival(next, config, placed.node.id);
  return log(next, `Played ${def?.label ?? held.cardId}.`);
}

function applyBrancher(
  state: TimelineState,
  config: TimelineConfig,
  fromNodeId: string,
  instanceId: string,
): TimelineState {
  getNode(state, fromNodeId);
  const locked = manipulationBlocked(
    state,
    getNode(state, fromNodeId).branchId,
  );
  if (locked) return log(state, locked);
  if (
    !state.debugMode &&
    Object.keys(state.branches).length >= (config.maxBranches ?? 12)
  ) {
    return log(state, "No more than 12 branches.");
  }
  const held = state.hand.find((c) => c.instanceId === instanceId);
  if (!held) {
    return log(state, "Brancher needs an action card from your hand.");
  }
  const def = cardById(config, held.cardId);
  if (!isActionCard(def)) {
    return log(state, "Brancher needs an action card, not a random event.");
  }
  const without = {
    ...state,
    hand: state.hand.filter((c) => c.instanceId !== instanceId),
  };
  const forked = createFork(without, fromNodeId, held);
  let next = log(
    forked.state,
    `Brancher: ${forked.branch.label} opens with ${def?.label ?? held.cardId}. Gained a crystal.`,
  );
  next = moveTraveler(next, config, forked.node.id, { resolve: false });
  next = resolveArrival(next, config, forked.node.id);
  return next;
}

function applyReverser(
  state: TimelineState,
  config: TimelineConfig,
  toNodeId: string,
): TimelineState {
  if (
    !isAncestor(state, toNodeId, state.travelerNodeId) &&
    toNodeId !== state.travelerNodeId &&
    !state.debugMode
  ) {
    return log(state, "Reverser can only target your past.");
  }
  return log(
    moveTraveler(state, config, toNodeId, { resolve: false }),
    "Reverser: jumped into the past.",
  );
}

function applyRelocator(
  state: TimelineState,
  branchId: string,
  newParentNodeId: string,
): TimelineState {
  const branch = getBranch(state, branchId);
  if (isPrimary(state, branchId)) {
    return log(state, "Cannot relocate Prime.");
  }
  const locked = manipulationBlocked(state, branchId);
  if (locked) return log(state, locked);
  const root = getNode(state, branch.rootNodeId);
  const newParent = getNode(state, newParentNodeId);
  if (
    newParentNodeId === branch.rootNodeId ||
    descendantIds(state, branch.rootNodeId).has(newParentNodeId)
  ) {
    return log(state, "Relocator refused: that would loop time.");
  }
  const nodes = { ...state.nodes };
  for (const oldParentId of root.parentIds) {
    const oldParent = nodes[oldParentId];
    nodes[oldParentId] = {
      ...oldParent,
      childIds: oldParent.childIds.filter((id) => id !== root.id),
    };
  }
  nodes[newParentNodeId] = {
    ...nodes[newParentNodeId],
    childIds: [...nodes[newParentNodeId].childIds, root.id],
  };
  nodes[root.id] = { ...root, parentIds: [newParentNodeId] };
  let next: TimelineState = {
    ...state,
    nodes,
    branches: {
      ...state.branches,
      [branchId]: {
        ...branch,
        parentBranchId: newParent.branchId,
        forkNodeId: newParentNodeId,
      },
    },
  };
  next = recomputeDepths(next);
  return log(next, `Relocator: ${branch.label} now forks from a new parent.`);
}

function applyPruner(
  state: TimelineState,
  config: TimelineConfig,
  branchId: string,
): TimelineState {
  if (isPrimary(state, branchId)) {
    return log(state, "Cannot prune Prime.");
  }
  const locked = manipulationBlocked(state, branchId);
  if (locked) return log(state, locked);
  const branch = getBranch(state, branchId);
  const root = getNode(state, branch.rootNodeId);
  const removed = new Set<string>([root.id, ...descendantIds(state, root.id)]);
  const nodes = { ...state.nodes };
  for (const parentId of root.parentIds) {
    if (removed.has(parentId)) continue;
    const parent = nodes[parentId];
    if (!parent) continue;
    nodes[parentId] = {
      ...parent,
      childIds: parent.childIds.filter((id) => !removed.has(id)),
    };
  }
  let next: TimelineState = { ...state, nodes };
  for (const id of removed) {
    const node = state.nodes[id];
    if (node?.card) {
      const def = cardById(config, node.card.cardId);
      if (def) next = returnCard(next, node.card.cardId, def.family);
    }
  }
  const remainingNodes = { ...next.nodes };
  for (const id of removed) delete remainingNodes[id];
  const remainingBranches = { ...next.branches };
  for (const br of Object.values(next.branches)) {
    if (removed.has(br.rootNodeId) || removed.has(br.headNodeId)) {
      delete remainingBranches[br.id];
    }
  }
  delete remainingBranches[branchId];
  let travelerNodeId = next.travelerNodeId;
  if (removed.has(travelerNodeId)) {
    travelerNodeId = branch.forkNodeId ?? next.epochNodeId;
  }
  next = {
    ...next,
    nodes: remainingNodes,
    branches: remainingBranches,
    travelerNodeId,
  };
  return log(
    next,
    `Pruner: ${branch.label} collapsed. Events returned to decks.`,
  );
}

function applyMerger(
  state: TimelineState,
  config: TimelineConfig,
  branchIdA: string,
  branchIdB: string,
): TimelineState {
  if (branchIdA === branchIdB) {
    return log(state, "Merger needs two different branches.");
  }
  const a = getBranch(state, branchIdA);
  const b = getBranch(state, branchIdB);
  const locked =
    manipulationBlocked(state, branchIdA) ??
    manipulationBlocked(state, branchIdB);
  if (locked) return log(state, locked);
  if (
    !state.debugMode &&
    Object.keys(state.branches).length >= (config.maxBranches ?? 12)
  ) {
    return log(state, "No more than 12 branches.");
  }
  const headA = getNode(state, a.headNodeId);
  const headB = getNode(state, b.headNodeId);
  const branchAlloc = alloc(state, "b");
  const nodeAlloc = {
    id: `n${branchAlloc.nextId}`,
    nextId: branchAlloc.nextId + 1,
  };
  const index =
    Math.max(...Object.values(state.branches).map((br) => br.index)) + 1;
  const mergeNode: TimelineNode = {
    id: nodeAlloc.id,
    branchId: branchAlloc.id,
    depth: Math.max(headA.depth, headB.depth) + 1,
    parentIds: [headA.id, headB.id],
    childIds: [],
    card: null,
    revealed: true,
  };
  const mergeBranch: TimelineBranch = {
    id: branchAlloc.id,
    index,
    label: `Confluence ${index}`,
    headNodeId: mergeNode.id,
    rootNodeId: mergeNode.id,
    parentBranchId: a.id,
    forkNodeId: headA.id,
    crystals: 1,
    preserved: false,
  };
  const nodes = {
    ...state.nodes,
    [headA.id]: { ...headA, childIds: [...headA.childIds, mergeNode.id] },
    [headB.id]: { ...headB, childIds: [...headB.childIds, mergeNode.id] },
    [mergeNode.id]: mergeNode,
  };
  let next: TimelineState = {
    ...state,
    nextId: nodeAlloc.nextId,
    nodes,
    branches: { ...state.branches, [mergeBranch.id]: mergeBranch },
    player: { ...state.player, crystals: state.player.crystals + 1 },
    travelerNodeId: mergeNode.id,
  };
  next = recomputeDepths(next);
  return log(
    next,
    `Merger: ${a.label} and ${b.label} join at ${mergeBranch.label}.`,
  );
}

function applyRewriter(
  state: TimelineState,
  config: TimelineConfig,
  nodeId: string,
  replacementCardId: string,
): TimelineState {
  const node = getNode(state, nodeId);
  if (!node.card) return log(state, "Nothing here to rewrite.");
  const locked = manipulationBlocked(state, node.branchId);
  if (locked) return log(state, locked);
  const incoming = cardById(config, replacementCardId);
  if (!incoming) return log(state, `Unknown replacement ${replacementCardId}.`);
  const outgoing = cardById(config, node.card.cardId);
  let next = state;
  if (outgoing) next = returnCard(next, node.card.cardId, outgoing.family);
  const made = newCardInstance(next, replacementCardId);
  next = {
    ...made.state,
    nodes: {
      ...made.state.nodes,
      [nodeId]: { ...node, card: made.card, revealed: true },
    },
  };
  return log(
    next,
    `Rewriter: ${outgoing?.label ?? "card"} → ${incoming.label}.`,
  );
}

function applyPreserver(state: TimelineState, branchId: string): TimelineState {
  const branch = getBranch(state, branchId);
  const preserved = !branch.preserved;
  return log(
    {
      ...state,
      branches: {
        ...state.branches,
        [branchId]: { ...branch, preserved },
      },
    },
    preserved
      ? `Preserver: ${branch.label} is locked.`
      : `Preserver: ${branch.label} is unlocked.`,
  );
}

function applyJumper(
  state: TimelineState,
  config: TimelineConfig,
  toNodeId: string,
): TimelineState {
  const allowed = jumperTargets(state, config);
  if (!allowed.includes(toNodeId) && !state.debugMode) {
    return log(state, "Jumper can skip at most 3 spaces ahead.");
  }
  getNode(state, toNodeId);
  return log(
    moveTraveler(state, config, toNodeId, { resolve: true }),
    "Jumper: skipped ahead.",
  );
}

function takeCrystal(state: TimelineState, branchId: string): TimelineState {
  const branch = getBranch(state, branchId);
  if (isPrimary(state, branchId)) {
    return log(state, "Prime has no time crystals.");
  }
  if (branch.crystals <= 0) {
    return log(state, `${branch.label} has no crystals left.`);
  }
  return log(
    {
      ...state,
      branches: {
        ...state.branches,
        [branchId]: { ...branch, crystals: branch.crystals - 1 },
      },
      player: { ...state.player, crystals: state.player.crystals + 1 },
    },
    `Took a crystal from ${branch.label}.`,
  );
}

function claimObjective(
  state: TimelineState,
  objectiveId: string,
): TimelineState {
  const spec = state.player.objectives.find((o) => o.id === objectiveId);
  if (!spec) return log(state, "Unknown objective.");
  if (spec.complete) return log(state, "That objective is already complete.");
  if (state.player.pendingClaimIds.includes(objectiveId)) {
    return log(state, "Already claimed — it must hold until your next turn.");
  }
  if (!objectiveIsPresent(state, spec) && !state.debugMode) {
    return log(state, "That person, place, and thing are not on one timeline.");
  }
  if (!objectiveIsPresent(state, spec) && state.debugMode) {
    return log(
      state,
      "Trio is not present (debug will still pend the claim).",
    );
  }
  return log(
    {
      ...state,
      player: {
        ...state.player,
        pendingClaimIds: [...state.player.pendingClaimIds, objectiveId],
      },
    },
    `Claimed ${objectiveId}. It must hold until your next turn.`,
  );
}

function endTurn(state: TimelineState, config: TimelineConfig): TimelineState {
  let next = state;
  const stillPending: string[] = [];
  let completedCount = next.player.completedCount;
  const objectives = next.player.objectives.map((o) => ({ ...o }));
  for (const id of next.player.pendingClaimIds) {
    const spec = objectives.find((o) => o.id === id);
    if (!spec) continue;
    if (objectiveIsPresent(next, spec)) {
      spec.complete = true;
      completedCount += 1;
      next = log(next, `Objective ${id} holds — complete.`);
    } else {
      next = log(next, `Objective ${id} broke and is not complete.`);
    }
  }
  next = {
    ...next,
    player: {
      ...next.player,
      objectives,
      pendingClaimIds: stillPending,
      completedCount,
    },
    status:
      completedCount >= 3
        ? "won"
        : next.status === "won"
          ? "won"
          : "playing",
  };
  if (completedCount >= 3) {
    return log(next, "Three objectives complete. You win.");
  }
  next = drawFrom(next, config, "action");
  next = drawFrom(next, config, "action");
  return log(next, "New turn. Drew 2.");
}

function endOfTimeStay(state: TimelineState): TimelineState {
  if (state.status !== "endOfTime" && !state.debugMode) return state;
  return log(
    {
      ...state,
      status: "playing",
      player: { ...state.player, crystals: state.player.crystals + 1 },
    },
    "Stayed at the end of time. Gained 1 crystal.",
  );
}

function endOfTimeRoll(
  state: TimelineState,
  branchIndex?: number,
): TimelineState {
  const mats = Object.values(state.branches);
  let target = mats.find((b) => b.index === branchIndex);
  if (!target) {
    let current = state;
    for (let i = 0; i < 24; i += 1) {
      const r = nextRand(current);
      current = r.state;
      const roll = 1 + Math.floor(r.value * 12);
      target = mats.find((b) => b.index === roll);
      if (target) {
        state = current;
        break;
      }
    }
  }
  if (!target) return log(state, "No branch mat matched the roll.");
  return log(
    {
      ...state,
      status: "playing",
      travelerNodeId: target.rootNodeId,
    },
    `Rolled branch mat ${target.index} (${target.label}).`,
  );
}

function debugBuildDevice(
  state: TimelineState,
  config: TimelineConfig,
  deviceId: DeviceId,
): TimelineState {
  const def = deviceById(config, deviceId);
  if (!def) return log(state, "Unknown device.");
  const max = config.maxDevices ?? 3;
  if (!state.debugMode && state.player.devices.length >= max) {
    return log(state, "Only 3 device slots.");
  }
  if (!state.debugMode && !state.player.blueprints.includes(deviceId)) {
    return log(state, "Need that blueprint on your mat first.");
  }
  const allocated = alloc(state, "d");
  const built = {
    instanceId: allocated.id,
    deviceId,
    usesLeft: def.uses,
  };
  const devices =
    state.player.devices.length >= max
      ? [...state.player.devices.slice(1), built]
      : [...state.player.devices, built];
  return log(
    {
      ...state,
      nextId: allocated.nextId,
      player: { ...state.player, devices },
    },
    `Built ${def.label} into a device slot.`,
  );
}

export function applyTimelineAction(
  state: TimelineState,
  config: TimelineConfig,
  action: TimelineAction,
): TimelineState {
  switch (action.type) {
    case "setDebugMode":
      return log(
        { ...state, debugMode: action.enabled },
        action.enabled ? "Debug on — rules skipped." : "Debug off.",
      );
    case "moveTo":
      return moveTraveler(state, config, action.nodeId, {
        resolve: state.debugMode,
      });
    case "stepForward": {
      const next = nextAlongBranch(state, state.travelerNodeId);
      if (!next) return log(state, "Already at the head of this branch.");
      return moveTraveler(state, config, next, { resolve: true });
    }
    case "stepBack": {
      const prev = previousAlongPath(state, state.travelerNodeId);
      if (!prev) return log(state, "Already at epoch.");
      return moveTraveler(state, config, prev, { resolve: false });
    }
    case "draw":
      return drawFrom(state, config, action.deck);
    case "debugAddCard": {
      if (!cardById(config, action.cardId)) {
        return log(state, `Unknown card ${action.cardId}.`);
      }
      const made = newCardInstance(state, action.cardId);
      const def = cardById(config, action.cardId);
      return log(
        { ...made.state, hand: [...made.state.hand, made.card] },
        `Added ${def?.label ?? action.cardId} to hand.`,
      );
    }
    case "debugSetResource":
      return {
        ...state,
        player: {
          ...state.player,
          [action.resource]: clamp(
            state.player[action.resource] + action.delta,
          ),
        },
      };
    case "takeCrystal":
      return takeCrystal(state, action.branchId);
    case "playCard":
      return playCard(state, config, action.instanceId, action.atNodeId);
    case "deviceBrancher":
      return applyBrancher(
        state,
        config,
        action.fromNodeId,
        action.instanceId,
      );
    case "deviceReverser":
      return applyReverser(state, config, action.toNodeId);
    case "deviceRelocator":
      return applyRelocator(state, action.branchId, action.newParentNodeId);
    case "devicePruner":
      return applyPruner(state, config, action.branchId);
    case "deviceMerger":
      return applyMerger(state, config, action.branchIdA, action.branchIdB);
    case "deviceRewriter":
      return applyRewriter(
        state,
        config,
        action.nodeId,
        action.replacementCardId,
      );
    case "devicePreserver":
      return applyPreserver(state, action.branchId);
    case "deviceJumper":
      return applyJumper(state, config, action.toNodeId);
    case "debugBuildDevice":
      return debugBuildDevice(state, config, action.deviceId);
    case "claimObjective":
      return claimObjective(state, action.objectiveId);
    case "endTurn":
      return endTurn(state, config);
    case "endOfTimeStay":
      return endOfTimeStay(state);
    case "endOfTimeRoll":
      return endOfTimeRoll(state, action.branchIndex);
    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}
