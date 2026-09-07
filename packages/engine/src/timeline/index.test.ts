import { describe, expect, it } from "vitest";
import {
  applyTimelineAction,
  createInitialTimeline,
  isHead,
  isPreservedNode,
  jumperTargets,
  objectiveIsPresent,
  type TimelineConfig,
} from "./index.js";

const config: TimelineConfig = {
  debugMode: true,
  cards: [
    { id: "ada", label: "Ada", family: "event", eventKind: "person" },
    { id: "tesla", label: "Tesla", family: "event", eventKind: "person" },
    { id: "paris", label: "Paris", family: "event", eventKind: "place" },
    { id: "kyoto", label: "Kyoto", family: "event", eventKind: "place" },
    {
      id: "chrono",
      label: "Chronometer",
      family: "event",
      eventKind: "thing",
    },
    { id: "radio", label: "Radio", family: "event", eventKind: "thing" },
    {
      id: "culture",
      label: "Culture +1",
      family: "society",
      societyKind: "culture",
      societyValue: 1,
    },
    { id: "get-parts", label: "Get Parts", family: "resource", resourceKind: "parts" },
    {
      id: "draw-random",
      label: "Random Event",
      family: "random-draw",
    },
    {
      id: "draw-blueprint",
      label: "Draw Blueprint",
      family: "draw-blueprint",
    },
    {
      id: "blueprint-brancher",
      label: "Brancher Blueprint",
      family: "blueprint",
      deviceId: "brancher",
    },
  ],
  devices: [
    {
      id: "brancher",
      letter: "A",
      label: "Brancher",
      summary: "Fork",
      uses: 3,
      requirements: {
        parts: 2,
        minerals: 5,
        crystals: 1,
        culture: 4,
        science: 2,
        politics: 0,
      },
    },
    {
      id: "reverser",
      letter: "B",
      label: "Reverser",
      summary: "Back",
      uses: 3,
      requirements: {
        parts: 3,
        minerals: 1,
        crystals: 1,
        culture: 5,
        science: 5,
        politics: 5,
      },
    },
    {
      id: "relocator",
      letter: "C",
      label: "Relocator",
      summary: "Move",
      uses: 3,
      requirements: {
        parts: 3,
        minerals: 3,
        crystals: 1,
        culture: 2,
        science: 4,
        politics: 1,
      },
    },
    {
      id: "pruner",
      letter: "D",
      label: "Pruner",
      summary: "Cut",
      uses: 3,
      requirements: {
        parts: 3,
        minerals: 3,
        crystals: 1,
        culture: 3,
        science: 3,
        politics: 3,
      },
    },
    {
      id: "merger",
      letter: "E",
      label: "Merger",
      summary: "Join",
      uses: 3,
      requirements: {
        parts: 5,
        minerals: 1,
        crystals: 1,
        culture: 1,
        science: 1,
        politics: 5,
      },
    },
    {
      id: "rewriter",
      letter: "F",
      label: "Rewriter",
      summary: "Swap",
      uses: 3,
      requirements: {
        parts: 1,
        minerals: 3,
        crystals: 1,
        culture: 1,
        science: 3,
        politics: 1,
      },
    },
    {
      id: "preserver",
      letter: "G",
      label: "Preserver",
      summary: "Lock",
      uses: 3,
      requirements: {
        parts: 1,
        minerals: 1,
        crystals: 1,
        culture: 1,
        science: 1,
        politics: 1,
      },
    },
    {
      id: "jumper",
      letter: "H",
      label: "Jumper",
      summary: "Skip",
      uses: 3,
      requirements: {
        parts: 1,
        minerals: 1,
        crystals: 1,
        culture: 1,
        science: 1,
        politics: 1,
      },
    },
  ],
  objectives: [
    { id: "obj-1", personId: "ada", placeId: "paris", thingId: "chrono" },
  ],
  seedCardIds: ["ada", "paris", "chrono", "culture"],
  startingHand: ["get-parts"],
  startingResources: { parts: 0, minerals: 0, crystals: 0 },
};

function nodeByCard(cardId: string, state = createInitialTimeline(config)) {
  return Object.values(state.nodes).find((n) => n.card?.cardId === cardId)!;
}

function apply(state: ReturnType<typeof createInitialTimeline>, action: Parameters<typeof applyTimelineAction>[2]) {
  return applyTimelineAction(state, config, action);
}

function brancherFrom(
  state: ReturnType<typeof createInitialTimeline>,
  fromNodeId: string,
  cardId = "get-parts",
) {
  const card = state.hand.find((c) => c.cardId === cardId)!;
  return apply(state, {
    type: "deviceBrancher",
    fromNodeId,
    instanceId: card.instanceId,
  });
}

describe("timeline", () => {
  it("starts at epoch with a seeded prime branch and no crystals on prime", () => {
    const state = createInitialTimeline(config);
    expect(state.travelerNodeId).toBe(state.epochNodeId);
    expect(state.branches[state.primaryBranchId].crystals).toBe(0);
    expect(state.branches[state.primaryBranchId].index).toBe(1);
    expect(nodeByCard("ada", state)).toBeTruthy();
    expect(state.debugMode).toBe(true);
    expect(state.hand).toHaveLength(1);
    expect(state.omegaDeck.length).toBeGreaterThan(0);
    expect(state.blueprintDeck).toContain("blueprint-brancher");
  });

  it("steps forward along the seeded past", () => {
    const start = createInitialTimeline(config);
    const next = apply(start, { type: "stepForward" });
    expect(next.travelerNodeId).toBe(nodeByCard("ada", start).id);
  });

  it("plays a card at the head to append", () => {
    let state = createInitialTimeline(config);
    const parts = state.hand.find((c) => c.cardId === "get-parts")!;
    const head = state.branches[state.primaryBranchId].headNodeId;
    expect(isHead(state, head)).toBe(true);
    state = apply(state, {
      type: "playCard",
      instanceId: parts.instanceId,
      atNodeId: head,
    });
    expect(state.nodes[state.travelerNodeId].card?.cardId).toBe("get-parts");
    expect(state.branches[state.primaryBranchId].headNodeId).toBe(
      state.travelerNodeId,
    );
  });

  it("Brancher forks a new mat with a crystal and a card from hand", () => {
    const start = createInitialTimeline(config);
    const paris = nodeByCard("paris", start);
    const parts = start.hand.find((c) => c.cardId === "get-parts")!;
    const next = apply(start, {
      type: "deviceBrancher",
      fromNodeId: paris.id,
      instanceId: parts.instanceId,
    });
    expect(Object.keys(next.branches).length).toBe(2);
    const fork = Object.values(next.branches).find((b) => b.index === 2)!;
    expect(fork.crystals).toBe(1);
    expect(next.player.crystals).toBe(1);
    expect(next.travelerNodeId).toBe(fork.rootNodeId);
    expect(next.nodes[fork.rootNodeId].card?.cardId).toBe("get-parts");
    expect(next.hand.find((c) => c.instanceId === parts.instanceId)).toBeUndefined();
    expect(next.nodes[paris.id].childIds.length).toBeGreaterThan(
      start.nodes[paris.id].childIds.length,
    );
  });

  it("Brancher without a valid card does not fork", () => {
    const start = createInitialTimeline(config);
    const next = apply(start, {
      type: "deviceBrancher",
      fromNodeId: start.epochNodeId,
      instanceId: "missing",
    });
    expect(Object.keys(next.branches).length).toBe(1);
    expect(next.log.at(-1)).toMatch(/action card/i);
  });

  it("spends a use when a slotted Brancher fires in debug", () => {
    let state = createInitialTimeline(config);
    state = apply(state, { type: "debugBuildDevice", deviceId: "brancher" });
    expect(state.player.devices[0]?.usesLeft).toBe(3);
    const crystalsBefore = state.player.crystals;
    const parts = state.hand.find((c) => c.cardId === "get-parts")!;
    const next = apply(state, {
      type: "deviceBrancher",
      fromNodeId: state.epochNodeId,
      instanceId: parts.instanceId,
    });
    expect(Object.keys(next.branches).length).toBe(2);
    expect(next.player.devices[0]?.usesLeft).toBe(2);
    expect(next.player.crystals).toBe(crystalsBefore + 1);
  });

  it("does not spend a use when Brancher fails", () => {
    let state = createInitialTimeline(config);
    state = apply(state, { type: "debugBuildDevice", deviceId: "brancher" });
    const next = apply(state, {
      type: "deviceBrancher",
      fromNodeId: state.epochNodeId,
      instanceId: "missing",
    });
    expect(Object.keys(next.branches).length).toBe(1);
    expect(next.player.devices[0]?.usesLeft).toBe(3);
  });

  it("works with zero resources in debug", () => {
    const start = createInitialTimeline(config);
    expect(start.player.parts).toBe(0);
    const parts = start.hand.find((c) => c.cardId === "get-parts")!;
    const next = apply(start, {
      type: "deviceBrancher",
      fromNodeId: start.epochNodeId,
      instanceId: parts.instanceId,
    });
    expect(Object.keys(next.branches).length).toBe(2);
    expect(next.nodes[Object.values(next.branches).find((b) => b.index === 2)!.rootNodeId].card?.cardId).toBe("get-parts");
  });

  it("Reverser jumps to an ancestor", () => {
    let state = createInitialTimeline(config);
    state = apply(state, { type: "stepForward" });
    state = apply(state, { type: "stepForward" });
    const next = apply(state, {
      type: "deviceReverser",
      toNodeId: state.epochNodeId,
    });
    expect(next.travelerNodeId).toBe(state.epochNodeId);
  });

  it("Relocator re-parents a fork and refuses a cycle", () => {
    const start = createInitialTimeline(config);
    const paris = nodeByCard("paris", start);
    const ada = nodeByCard("ada", start);
    let state = brancherFrom(start, paris.id);
    const fork = Object.values(state.branches).find((b) => b.index === 2)!;
    state = apply(state, {
      type: "deviceRelocator",
      branchId: fork.id,
      newParentNodeId: ada.id,
    });
    expect(state.nodes[fork.rootNodeId].parentIds).toEqual([ada.id]);
    expect(state.nodes[paris.id].childIds).not.toContain(fork.rootNodeId);

    const cycled = apply(state, {
      type: "deviceRelocator",
      branchId: fork.id,
      newParentNodeId: fork.rootNodeId,
    });
    expect(cycled.log.at(-1)).toMatch(/loop/i);
  });

  it("Pruner deletes a fork and returns its cards to the matching pile", () => {
    const start = createInitialTimeline(config);
    const parts = start.hand.find((c) => c.cardId === "get-parts")!;
    const paris = nodeByCard("paris", start);
    let state = apply(start, {
      type: "playCard",
      instanceId: parts.instanceId,
      atNodeId: paris.id,
    });
    const fork = Object.values(state.branches).find((b) => b.index === 2)!;
    expect(state.nodes[fork.rootNodeId].card?.cardId).toBe("get-parts");
    const before = state.actionDeck.filter((id) => id === "get-parts").length;
    state = apply(state, { type: "devicePruner", nodeId: fork.headNodeId });
    expect(state.branches[fork.id]).toBeUndefined();
    expect(state.actionDeck.filter((id) => id === "get-parts").length).toBe(
      before + 1,
    );
  });

  it("Pruner cuts Prime only down to the latest fork", () => {
    const start = createInitialTimeline(config);
    const paris = nodeByCard("paris", start);
    let state = brancherFrom(start, paris.id);
    const culture = nodeByCard("culture", state);
    const chrono = nodeByCard("chrono", state);
    state = apply(state, { type: "devicePruner", nodeId: culture.id });
    expect(state.nodes[culture.id]).toBeUndefined();
    expect(state.nodes[chrono.id]).toBeUndefined();
    expect(state.nodes[paris.id]).toBeTruthy();
    expect(state.branches[state.primaryBranchId].headNodeId).toBe(paris.id);
    expect(Object.keys(state.branches).length).toBe(2);
  });

  it("Pruner refuses a merged branch", () => {
    const start = createInitialTimeline(config);
    const paris = nodeByCard("paris", start);
    let state = brancherFrom(start, paris.id);
    const fork = Object.values(state.branches).find((b) => b.index === 2)!;
    const into = nodeByCard("chrono", state);
    state = apply(state, {
      type: "deviceMerger",
      fromBranchId: fork.id,
      intoNodeId: into.id,
    });
    const next = apply(state, {
      type: "devicePruner",
      nodeId: fork.headNodeId,
    });
    expect(next.branches[fork.id]).toBeTruthy();
    expect(next.log.at(-1)).toMatch(/loose end|junction/i);
  });

  it("Merger ends one branch at the other branch’s head", () => {
    const start = createInitialTimeline(config);
    const paris = nodeByCard("paris", start);
    let state = brancherFrom(start, paris.id);
    const fork = Object.values(state.branches).find((b) => b.index === 2)!;
    const into = nodeByCard("chrono", state);
    const destHead = state.branches[into.branchId].headNodeId;
    const incomingHead = fork.headNodeId;
    state = apply(state, {
      type: "deviceMerger",
      fromBranchId: fork.id,
      intoNodeId: into.id,
    });
    expect(Object.keys(state.branches).length).toBe(2);
    expect(state.branches[fork.id].mergedIntoNodeId).toBe(destHead);
    expect(state.nodes[destHead].parentIds).not.toContain(incomingHead);
    expect(state.nodes[incomingHead].childIds).not.toContain(destHead);
    expect(state.travelerNodeId).toBe(destHead);
    expect(isHead(state, incomingHead)).toBe(false);
    expect(isHead(state, destHead)).toBe(true);
    expect(
      Object.values(state.branches).some((b) =>
        b.label.startsWith("Confluence"),
      ),
    ).toBe(false);
  });

  it("refuses to play onto a merged timeline", () => {
    const start = createInitialTimeline({
      ...config,
      startingHand: ["get-parts", "draw-random"],
    });
    const paris = nodeByCard("paris", start);
    let state = brancherFrom(start, paris.id, "get-parts");
    const fork = Object.values(state.branches).find((b) => b.index === 2)!;
    const culture = nodeByCard("culture", start);
    state = apply(state, {
      type: "deviceMerger",
      fromBranchId: fork.id,
      intoNodeId: culture.id,
    });
    const leftover = state.hand.find((c) => c.cardId === "draw-random")!;
    const next = apply(state, {
      type: "playCard",
      instanceId: leftover.instanceId,
      atNodeId: fork.headNodeId,
    });
    expect(next.nodes[fork.headNodeId].childIds).toEqual(
      state.nodes[fork.headNodeId].childIds,
    );
    expect(next.log.at(-1)).toMatch(/already merged/i);
  });

  it("Rewriter swaps a hand card with a timeline card", () => {
    const start = createInitialTimeline(config);
    const culture = nodeByCard("culture", start);
    const parts = start.hand.find((c) => c.cardId === "get-parts")!;
    const next = apply(start, {
      type: "deviceRewriter",
      nodeId: culture.id,
      instanceId: parts.instanceId,
    });
    expect(next.nodes[culture.id].card?.cardId).toBe("get-parts");
    expect(next.hand.some((c) => c.cardId === "culture")).toBe(true);
    expect(next.hand.some((c) => c.instanceId === parts.instanceId)).toBe(
      false,
    );
  });

  it("Rewriter refuses Omega event cards", () => {
    let state = createInitialTimeline(config);
    state = apply(state, { type: "debugAddCard", cardId: "tesla" });
    const tesla = state.hand.find((c) => c.cardId === "tesla")!;
    const ada = nodeByCard("ada", state);
    const next = apply(state, {
      type: "deviceRewriter",
      nodeId: ada.id,
      instanceId: tesla.instanceId,
    });
    expect(next.nodes[ada.id].card?.cardId).toBe("ada");
    expect(next.log.at(-1)).toMatch(/Omega/i);
  });

  it("Random Event places the top Omega card and returns to the action pile", () => {
    const start = createInitialTimeline({
      ...config,
      startingHand: ["draw-random"],
    });
    const top = start.omegaDeck[0];
    const card = start.hand.find((c) => c.cardId === "draw-random")!;
    const next = apply(start, {
      type: "playCard",
      instanceId: card.instanceId,
      atNodeId: start.travelerNodeId,
    });
    expect(next.nodes[next.travelerNodeId].card?.cardId).toBe(top);
    expect(next.hand.some((c) => c.cardId === "draw-random")).toBe(false);
    expect(next.actionDeck.includes("draw-random")).toBe(true);
    expect(next.omegaDeck.length).toBe(start.omegaDeck.length - 1);
  });

  it("Draw Blueprint adds a blueprint to hand and stays on the timeline", () => {
    const start = createInitialTimeline({
      ...config,
      startingHand: ["draw-blueprint"],
    });
    const card = start.hand.find((c) => c.cardId === "draw-blueprint")!;
    const top = start.blueprintDeck[0];
    const next = apply(start, {
      type: "playCard",
      instanceId: card.instanceId,
      atNodeId: start.travelerNodeId,
    });
    expect(next.nodes[next.travelerNodeId].card?.cardId).toBe("draw-blueprint");
    expect(next.hand.some((c) => c.cardId === top)).toBe(true);
    expect(next.blueprintDeck.length).toBe(start.blueprintDeck.length - 1);
  });

  it("Preserver locks only cards up to the chosen moment", () => {
    const start = createInitialTimeline(config);
    const ada = nodeByCard("ada", start);
    const culture = nodeByCard("culture", start);
    const locked = apply(start, {
      type: "devicePreserver",
      nodeId: ada.id,
    });
    expect(locked.branches[start.primaryBranchId].preservedThroughNodeId).toBe(
      ada.id,
    );
    expect(isPreservedNode(locked, ada.id)).toBe(true);
    expect(isPreservedNode(locked, culture.id)).toBe(false);
    const parts = locked.hand.find((c) => c.cardId === "get-parts")!;
    const grown = apply(locked, {
      type: "playCard",
      instanceId: parts.instanceId,
      atNodeId: locked.branches[locked.primaryBranchId].headNodeId,
    });
    expect(isPreservedNode(grown, ada.id)).toBe(true);
    expect(isPreservedNode(grown, grown.travelerNodeId)).toBe(false);
  });

  it("Rewriter refuses a preserved card when debug is off", () => {
    let state = createInitialTimeline(config);
    const ada = nodeByCard("ada", state);
    state = apply(state, { type: "debugBuildDevice", deviceId: "preserver" });
    state = apply(state, { type: "debugBuildDevice", deviceId: "rewriter" });
    state = apply(state, { type: "devicePreserver", nodeId: ada.id });
    state = apply(state, { type: "setDebugMode", enabled: false });
    state = apply(state, {
      type: "debugSetResource",
      resource: "crystals",
      delta: 1,
    });
    const parts = state.hand.find((c) => c.cardId === "get-parts")!;
    const next = apply(state, {
      type: "deviceRewriter",
      nodeId: ada.id,
      instanceId: parts.instanceId,
    });
    expect(next.nodes[ada.id].card?.cardId).toBe("ada");
    expect(next.log.at(-1)).toMatch(/preserved/i);
  });

  it("Jumper skips ahead up to 3 spaces", () => {
    const start = createInitialTimeline(config);
    const targets = jumperTargets(start, config);
    expect(targets.length).toBeGreaterThanOrEqual(3);
    const next = apply(start, {
      type: "deviceJumper",
      toNodeId: targets[1],
    });
    expect(next.travelerNodeId).toBe(targets[1]);
  });

  it("claims an objective that is present and completes it next turn", () => {
    const start = createInitialTimeline(config);
    expect(objectiveIsPresent(start, start.player.objectives[0])).toBe(true);
    let state = apply(start, { type: "claimObjective", objectiveId: "obj-1" });
    expect(state.player.pendingClaimIds).toContain("obj-1");
    state = apply(state, { type: "endTurn" });
    expect(state.player.objectives[0].complete).toBe(true);
    expect(state.player.completedCount).toBe(1);
  });

  it("draws from the action pile", () => {
    const start = createInitialTimeline(config);
    expect(start.actionDeck.length).toBeGreaterThan(0);
    const next = apply(start, { type: "draw" });
    expect(next.hand.length).toBe(start.hand.length + 1);
    expect(next.actionDeck.length).toBe(start.actionDeck.length - 1);
  });
});
