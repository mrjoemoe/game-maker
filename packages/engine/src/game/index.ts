import { createBoard, getCell, type Board, type BoardConfig } from "../board/index.js";
import {
  destinationFrom,
  type Direction,
} from "../grid/directions.js";
import { coordKey, isInBounds, neighbors, type Coord } from "../grid/index.js";
import {
  createItemRegistry,
  totalMaxHp,
  type ItemDefinition,
  type ItemRegistry,
} from "../items/index.js";
import {
  createPieceTypeRegistry,
  movePiece,
  type PieceInstance,
  type PieceTypeDefinition,
  type PieceTypeRegistry,
} from "../pieces/index.js";
import {
  clearBump,
  collectItem,
  consumeItem,
  createRunState,
  isSafePathEffect,
  markExtracted,
  markLost,
  markWon,
  mergeIntoStash,
  pathOverMessage,
  SHOP_ITEM_COST,
  type ProgramStep,
  type RunState,
} from "../run/index.js";
import {
  clearEdgeWall,
  flipTileState,
  isCrossingBlocked,
  resolveTileType,
  sideToward,
  tileEffect,
  type TileState,
} from "../tiles/index.js";

export type InitialPiece = {
  id: string;
  typeId: string;
  position: Coord;
};

export type RunConfig = {
  heroPieceId: string;
  startPosition: Coord;
  maxHp: number;
  baseAttack: number;
  /** Maximum atomic actions per program. Defaults to 10. */
  programLength?: number;
};

export type GameFeatures = {
  /** When false, flipTile actions leave face state unchanged. Defaults to true. */
  tileFlip?: boolean;
  /** When true, step/softReset run loop is active. Defaults to false. */
  runMode?: boolean;
};

export type GameDefinition = {
  id: string;
  name: string;
  /** Template this prototype is based on (e.g. "tile-board"). */
  templateId: string;
  features?: GameFeatures;
  board: BoardConfig;
  pieceTypes: PieceTypeDefinition[];
  initialPieces: InitialPiece[];
  /** Optional items available to the run. */
  items?: ItemDefinition[];
  /** Required when features.runMode is true. */
  run?: RunConfig;
};

export function isTileFlipEnabled(definition: GameDefinition): boolean {
  return definition.features?.tileFlip !== false;
}

export function isRunModeEnabled(definition: GameDefinition): boolean {
  return definition.features?.runMode === true;
}

export function runProgramLength(definition: GameDefinition): number {
  return definition.run?.programLength ?? 10;
}

export type GameState = {
  definition: GameDefinition;
  board: Board;
  pieceTypes: PieceTypeRegistry;
  pieces: PieceInstance[];
  items: ItemRegistry;
  run: RunState;
  /** Persistent stash between attempts; only updated on extract or win. */
  stashItemIds: string[];
  /** Persistent wallet; gathered coins are kept without extraction. */
  coins: number;
  /** Cells already credited to the wallet this attempt (soft reset clears). */
  claimedCoinKeys: string[];
};

export type GameAction =
  | { type: "flipTile"; coord: Coord }
  | { type: "movePiece"; pieceId: string; destination: Coord }
  | { type: "step"; pieceId: string; destination: Coord; usedItemId?: string }
  | { type: "programStep"; pieceId: string; step: ProgramStep }
  | { type: "runProgram"; pieceId: string; steps: ProgramStep[] }
  | { type: "commitLoadout"; itemIds: string[] }
  | { type: "softReset" }
  | { type: "reset" };

function requireRunConfig(definition: GameDefinition): RunConfig {
  if (!definition.run) {
    throw new Error(
      `Game definition "${definition.id}" has runMode enabled but no run config`,
    );
  }
  return definition.run;
}

function defaultRunConfig(definition: GameDefinition): RunConfig {
  const first = definition.initialPieces[0];
  return (
    definition.run ?? {
      heroPieceId: first?.id ?? "hero",
      startPosition: first?.position ?? { x: 0, y: 0 },
      maxHp: 100,
      baseAttack: 1,
    }
  );
}

function revealCell(cells: Record<string, TileState>, key: string): Record<string, TileState> {
  const current = cells[key];
  if (!current || current.isFaceUp) {
    return cells;
  }
  return {
    ...cells,
    [key]: { ...current, isFaceUp: true },
  };
}

function markResolved(cells: Record<string, TileState>, key: string): Record<string, TileState> {
  const current = cells[key];
  if (!current) {
    return cells;
  }
  return {
    ...cells,
    [key]: { ...current, resolved: true },
  };
}

function grantItem(run: RunState, itemId: string, items: ItemRegistry): RunState {
  if (!items[itemId]) {
    throw new Error(`Unknown item id: ${itemId}`);
  }
  return collectItem(run, itemId);
}

function bankRunInventory(state: GameState, run: RunState): {
  run: RunState;
  stashItemIds: string[];
} {
  return {
    run: { ...run, inventory: [] },
    stashItemIds: mergeIntoStash(state.stashItemIds, run.inventory),
  };
}

/**
 * Credit a cell’s coin stack to the wallet once per attempt.
 * Tile stacks stay on the board across collects and soft resets.
 */
function collectCellCoins(
  cells: Record<string, TileState>,
  key: string,
  wallet: number,
  claimedCoinKeys: string[],
): {
  cells: Record<string, TileState>;
  coins: number;
  collected: number;
  claimedCoinKeys: string[];
} {
  const cell = cells[key];
  if (!cell || claimedCoinKeys.includes(key)) {
    return { cells, coins: wallet, collected: 0, claimedCoinKeys };
  }
  const amount = cell.coins ?? 0;
  if (amount <= 0) {
    return { cells, coins: wallet, collected: 0, claimedCoinKeys };
  }
  return {
    cells,
    coins: wallet + amount,
    collected: amount,
    claimedCoinKeys: [...claimedCoinKeys, key],
  };
}

function withCoinPickupBump(
  run: RunState,
  collected: number,
  wallet: number,
): RunState {
  if (collected <= 0) {
    return run;
  }
  const noun = collected === 1 ? "coin" : "coins";
  return {
    ...run,
    bump: `Collected ${collected} ${noun} — wallet ${wallet}`,
  };
}

function effectiveMaxHp(state: GameState, inventory: string[]): number {
  const runConfig = defaultRunConfig(state.definition);
  return totalMaxHp(state.items, inventory, runConfig.maxHp);
}

function applyStep(
  state: GameState,
  pieceId: string,
  destination: Coord,
  usedItemId?: string,
): GameState {
  if (!isRunModeEnabled(state.definition) || state.run.status !== "playing") {
    return state;
  }

  const piece = state.pieces.find((p) => p.id === pieceId);
  if (!piece) {
    throw new Error(`Unknown piece id: ${pieceId}`);
  }

  if (!isInBounds(state.board.grid, destination)) {
    throw new Error(
      `Destination out of bounds: (${destination.x}, ${destination.y})`,
    );
  }

  const adjacent = neighbors(state.board.grid, piece.position).some(
    (n) => n.x === destination.x && n.y === destination.y,
  );
  if (!adjacent) {
    throw new Error(
      `Destination (${destination.x}, ${destination.y}) is not an orthogonal neighbor`,
    );
  }

  if (
    isCrossingBlocked(state.board.edgeWalls, piece.position, destination)
  ) {
    // Edge walls sit between tiles — reveal the destination so the player sees
    // what they bumped into across the shared edge.
    const cells = revealCell(state.board.cells, coordKey(destination));
    return {
      ...state,
      board: { ...state.board, cells },
      run: markLost(state.run, "You hit a wall between the tiles — path over"),
    };
  }

  const key = coordKey(destination);
  let cells = revealCell(state.board.cells, key);
  const cell = cells[key];
  const tileType = resolveTileType(state.board.tileTypes, cell.typeId);
  const effect = tileEffect(tileType);
  // Item must still be held (pass items are consumed on successful traverse).
  const armedPass =
    Boolean(usedItemId) &&
    tileType.passItemId === usedItemId &&
    state.run.inventory.includes(usedItemId!);

  // Extraction / shop / mage / empty are safe terrain.
  if (effect.kind === "mage" || isSafePathEffect(effect.kind)) {
    const pieces = movePiece(
      state.pieces,
      pieceId,
      destination,
      state.board.grid,
    );
    let run = clearBump(state.run);
    if (
      usedItemId &&
      state.items[usedItemId]?.breaksSideWalls &&
      run.inventory.includes(usedItemId)
    ) {
      run = consumeItem(run, usedItemId);
    }
    const gathered = collectCellCoins(
      cells,
      key,
      state.coins,
      state.claimedCoinKeys,
    );
    return {
      ...state,
      board: { ...state.board, cells: gathered.cells },
      pieces,
      run: withCoinPickupBump(run, gathered.collected, gathered.coins),
      coins: gathered.coins,
      claimedCoinKeys: gathered.claimedCoinKeys,
    };
  }

  // Explicitly used pass item: traverse rough terrain (goal wins + banks).
  if (armedPass && (effect.kind === "wall" || !isSafePathEffect(effect.kind))) {
    const pieces = movePiece(
      state.pieces,
      pieceId,
      destination,
      state.board.grid,
    );
    let run = clearBump(state.run);
    if (usedItemId) {
      run = consumeItem(run, usedItemId);
    }
    const gathered = collectCellCoins(
      cells,
      key,
      state.coins,
      state.claimedCoinKeys,
    );
    run = withCoinPickupBump(run, gathered.collected, gathered.coins);
    if (effect.kind === "goal") {
      const banked = bankRunInventory(
        { ...state, coins: gathered.coins },
        markWon(run),
      );
      return {
        ...state,
        board: { ...state.board, cells: gathered.cells },
        pieces,
        run: banked.run,
        stashItemIds: banked.stashItemIds,
        coins: gathered.coins,
        claimedCoinKeys: gathered.claimedCoinKeys,
      };
    }
    return {
      ...state,
      board: { ...state.board, cells: gathered.cells },
      pieces,
      run,
      coins: gathered.coins,
      claimedCoinKeys: gathered.claimedCoinKeys,
    };
  }

  // Full-cell wall (thicket/river): reveal, stay put, path ends.
  if (effect.kind === "wall") {
    return {
      ...state,
      board: { ...state.board, cells },
      run: markLost(state.run, `You hit a ${tileType.label} — path over`),
    };
  }

  // Hazards / caches / goal without the matching used item: path over.
  let lostRun = state.run;
  if (
    usedItemId &&
    state.items[usedItemId]?.breaksSideWalls &&
    lostRun.inventory.includes(usedItemId)
  ) {
    lostRun = consumeItem(lostRun, usedItemId);
  }
  const pieces = movePiece(
    state.pieces,
    pieceId,
    destination,
    state.board.grid,
  );
  return {
    ...state,
    board: { ...state.board, cells },
    pieces,
    run: markLost(lostRun, pathOverMessage(tileType.label)),
  };
}

function applyTakeFromMage(
  state: GameState,
  pieceId: string,
  itemId: string,
): GameState {
  const piece = state.pieces.find((p) => p.id === pieceId);
  if (!piece) {
    throw new Error(`Unknown piece id: ${pieceId}`);
  }
  const key = coordKey(piece.position);
  const cell = state.board.cells[key];
  if (!cell) {
    return {
      ...state,
      run: markLost(state.run, "No Mage here to take from — path over"),
    };
  }
  const tileType = resolveTileType(state.board.tileTypes, cell.typeId);
  if (tileEffect(tileType).kind !== "mage" || cell.resolved) {
    return {
      ...state,
      run: markLost(state.run, "No Mage here to take from — path over"),
    };
  }
  if (!state.items[itemId]) {
    throw new Error(`Unknown item id: ${itemId}`);
  }

  const granted = grantItem(state.run, itemId, state.items);
  const maxHp = effectiveMaxHp(state, granted.inventory);
  return {
    ...state,
    board: {
      ...state.board,
      cells: markResolved(state.board.cells, key),
    },
    run: {
      ...granted,
      maxHp,
      hp: Math.max(granted.hp, maxHp),
      bump: null,
    },
  };
}

function applyUseItemAction(
  state: GameState,
  pieceId: string,
  itemId: string,
  move: Direction,
): GameState {
  if (!state.run.inventory.includes(itemId)) {
    return {
      ...state,
      run: markLost(state.run, `You don't have that item — path over`),
    };
  }
  const item = state.items[itemId];
  if (!item) {
    throw new Error(`Unknown item id: ${itemId}`);
  }

  const piece = state.pieces.find((p) => p.id === pieceId);
  if (!piece) {
    throw new Error(`Unknown piece id: ${pieceId}`);
  }
  const destination = destinationFrom(piece.position, move);
  if (!isInBounds(state.board.grid, destination)) {
    return {
      ...state,
      run: markLost(state.run, `That action doesn't fit this move — path over`),
    };
  }

  const fromCell = state.board.cells[coordKey(piece.position)];
  const destCell = state.board.cells[coordKey(destination)];
  if (!fromCell || !destCell) {
    return {
      ...state,
      run: markLost(state.run, `That action doesn't fit this move — path over`),
    };
  }

  if (!sideToward(piece.position, destination)) {
    return {
      ...state,
      run: markLost(state.run, `That action doesn't fit this move — path over`),
    };
  }

  const blocked = isCrossingBlocked(
    state.board.edgeWalls,
    piece.position,
    destination,
  );

  if (item.breaksSideWalls) {
    if (!blocked) {
      return {
        ...state,
        run: markLost(state.run, "Sledgehammer found no wall — path over"),
      };
    }
    return {
      ...state,
      board: {
        ...state.board,
        edgeWalls: clearEdgeWall(
          state.board.edgeWalls,
          piece.position,
          destination,
        ),
      },
      run: clearBump(state.run),
    };
  }

  // Reveal destination to judge pass-item fit.
  const cells = revealCell(state.board.cells, coordKey(destination));
  const revealedDest = cells[coordKey(destination)];
  const destType = resolveTileType(state.board.tileTypes, revealedDest.typeId);

  // Matching pass item clears the shared edge (if any) so the move can enter.
  if (destType.passItemId === itemId) {
    return {
      ...state,
      board: {
        ...state.board,
        cells,
        edgeWalls: blocked
          ? clearEdgeWall(state.board.edgeWalls, piece.position, destination)
          : state.board.edgeWalls,
      },
      run: clearBump(state.run),
    };
  }

  if (blocked) {
    return {
      ...state,
      board: { ...state.board, cells },
      run: markLost(state.run, "You hit a wall between the tiles — path over"),
    };
  }

  return {
    ...state,
    board: { ...state.board, cells },
    run: markLost(
      state.run,
      `Wrong item for the ${destType.label} — path over`,
    ),
  };
}

function applyExtractAction(state: GameState, pieceId: string): GameState {
  const piece = state.pieces.find((p) => p.id === pieceId);
  if (!piece) {
    throw new Error(`Unknown piece id: ${pieceId}`);
  }
  const key = coordKey(piece.position);
  const cell = state.board.cells[key];
  if (!cell) {
    return {
      ...state,
      run: markLost(state.run, "No extraction point here — path over"),
    };
  }
  const tileType = resolveTileType(state.board.tileTypes, cell.typeId);
  if (tileEffect(tileType).kind !== "extraction") {
    return {
      ...state,
      run: markLost(state.run, "No extraction point here — path over"),
    };
  }

  const banked = bankRunInventory(state, clearBump(state.run));
  return {
    ...state,
    run: markExtracted(banked.run),
    stashItemIds: banked.stashItemIds,
  };
}

function applyBuyFromShop(
  state: GameState,
  pieceId: string,
  itemId: string,
): GameState {
  const piece = state.pieces.find((p) => p.id === pieceId);
  if (!piece) {
    throw new Error(`Unknown piece id: ${pieceId}`);
  }
  const key = coordKey(piece.position);
  const cell = state.board.cells[key];
  if (!cell) {
    return {
      ...state,
      run: markLost(state.run, "No shop here — path over"),
    };
  }
  const tileType = resolveTileType(state.board.tileTypes, cell.typeId);
  if (tileEffect(tileType).kind !== "shop") {
    return {
      ...state,
      run: markLost(state.run, "No shop here — path over"),
    };
  }
  if (!state.items[itemId]) {
    throw new Error(`Unknown item id: ${itemId}`);
  }
  if (state.coins < SHOP_ITEM_COST) {
    return {
      ...state,
      run: markLost(state.run, "Not enough coins — path over"),
    };
  }

  const granted = grantItem(state.run, itemId, state.items);
  const maxHp = effectiveMaxHp(state, granted.inventory);
  return {
    ...state,
    coins: state.coins - SHOP_ITEM_COST,
    run: {
      ...granted,
      maxHp,
      hp: Math.max(granted.hp, maxHp),
      bump: null,
    },
  };
}

function findPortalCell(
  state: GameState,
  portalId: number,
): { key: string; cell: TileState } | null {
  for (const [key, cell] of Object.entries(state.board.cells)) {
    const type = resolveTileType(state.board.tileTypes, cell.typeId);
    const effect = tileEffect(type);
    if (effect.kind === "portal" && effect.portalId === portalId) {
      return { key, cell };
    }
  }
  return null;
}

function applyTravelToPortal(
  state: GameState,
  pieceId: string,
  portalId: number,
): GameState {
  const piece = state.pieces.find((p) => p.id === pieceId);
  if (!piece) {
    throw new Error(`Unknown piece id: ${pieceId}`);
  }
  const fromKey = coordKey(piece.position);
  const fromCell = state.board.cells[fromKey];
  if (!fromCell) {
    return {
      ...state,
      run: markLost(state.run, "No portal here — path over"),
    };
  }
  const fromType = resolveTileType(state.board.tileTypes, fromCell.typeId);
  const fromEffect = tileEffect(fromType);
  if (fromEffect.kind !== "portal") {
    return {
      ...state,
      run: markLost(state.run, "No portal here — path over"),
    };
  }
  if (fromEffect.portalId === portalId) {
    return {
      ...state,
      run: markLost(state.run, "Already at that portal — path over"),
    };
  }

  const dest = findPortalCell(state, portalId);
  if (!dest) {
    return {
      ...state,
      run: markLost(state.run, `Portal ${portalId} not found — path over`),
    };
  }
  if (!dest.cell.isFaceUp) {
    return {
      ...state,
      run: markLost(
        state.run,
        `Portal ${portalId} is still hidden — path over`,
      ),
    };
  }

  const [xStr, yStr] = dest.key.split(",");
  const destination = { x: Number(xStr), y: Number(yStr) };
  const pieces = movePiece(
    state.pieces,
    pieceId,
    destination,
    state.board.grid,
  );
  const gathered = collectCellCoins(
    state.board.cells,
    dest.key,
    state.coins,
    state.claimedCoinKeys,
  );
  const travelMsg = `Traveled to Portal ${portalId}`;
  const noun = gathered.collected === 1 ? "coin" : "coins";
  const bump =
    gathered.collected > 0
      ? `${travelMsg} · Collected ${gathered.collected} ${noun} — wallet ${gathered.coins}`
      : travelMsg;
  return {
    ...state,
    board: { ...state.board, cells: gathered.cells },
    pieces,
    coins: gathered.coins,
    claimedCoinKeys: gathered.claimedCoinKeys,
    run: { ...clearBump(state.run), bump },
  };
}

function clearPendingUse(run: RunState): RunState {
  return run.pendingUseItemId ? { ...run, pendingUseItemId: null } : run;
}

function applyArmUseItem(state: GameState, itemId: string): GameState {
  if (!state.run.inventory.includes(itemId)) {
    return {
      ...state,
      run: markLost(state.run, `You don't have that item — path over`),
    };
  }
  if (!state.items[itemId]) {
    throw new Error(`Unknown item id: ${itemId}`);
  }
  if (state.run.pendingUseItemId) {
    return {
      ...state,
      run: markLost(
        state.run,
        "You already used an item — move first — path over",
      ),
    };
  }
  return {
    ...state,
    run: { ...clearBump(state.run), pendingUseItemId: itemId },
  };
}

function applyMoveAction(
  state: GameState,
  pieceId: string,
  direction: Direction,
): GameState {
  const pending = state.run.pendingUseItemId ?? null;
  let current = state;
  if (pending) {
    current = applyUseItemAction(current, pieceId, pending, direction);
    if (current.run.status !== "playing") {
      return {
        ...current,
        run: clearPendingUse(current.run),
      };
    }
  }

  const piece = current.pieces.find((p) => p.id === pieceId);
  if (!piece) {
    throw new Error(`Unknown piece id: ${pieceId}`);
  }
  const destination = destinationFrom(piece.position, direction);
  if (!isInBounds(current.board.grid, destination)) {
    return {
      ...current,
      run: markLost(
        clearPendingUse(current.run),
        "Can't move that way — path over",
      ),
    };
  }

  const moved = applyStep(
    current,
    pieceId,
    destination,
    pending ?? undefined,
  );
  return {
    ...moved,
    run: clearPendingUse(moved.run),
  };
}

function requireNoPendingUse(state: GameState): GameState | null {
  if (state.run.pendingUseItemId) {
    return {
      ...state,
      run: markLost(
        clearPendingUse(state.run),
        "You used an item but didn't move — path over",
      ),
    };
  }
  return null;
}

/**
 * Apply one atomic programmed action.
 */
function applyProgramStep(
  state: GameState,
  pieceId: string,
  step: ProgramStep,
): GameState {
  if (!isRunModeEnabled(state.definition) || state.run.status !== "playing") {
    return state;
  }

  switch (step.kind) {
    case "move":
      return applyMoveAction(state, pieceId, step.direction);
    case "useItem":
      return applyArmUseItem(state, step.itemId);
    case "takeFromMage": {
      const blocked = requireNoPendingUse(state);
      if (blocked) return blocked;
      return applyTakeFromMage(state, pieceId, step.itemId);
    }
    case "buyFromShop": {
      const blocked = requireNoPendingUse(state);
      if (blocked) return blocked;
      return applyBuyFromShop(state, pieceId, step.itemId);
    }
    case "extract": {
      const blocked = requireNoPendingUse(state);
      if (blocked) return blocked;
      return applyExtractAction(state, pieceId);
    }
    case "travelToPortal": {
      const blocked = requireNoPendingUse(state);
      if (blocked) return blocked;
      return applyTravelToPortal(state, pieceId, step.portalId);
    }
    default: {
      const _exhaustive: never = step;
      return _exhaustive;
    }
  }
}

/**
 * Execute a locked-in list of atomic actions (1..programLength).
 */
function applyRunProgram(
  state: GameState,
  pieceId: string,
  steps: ProgramStep[],
): GameState {
  if (!isRunModeEnabled(state.definition) || state.run.status !== "playing") {
    return state;
  }

  const maxSteps = runProgramLength(state.definition);
  if (steps.length < 1 || steps.length > maxSteps) {
    throw new Error(
      `Program must contain between 1 and ${maxSteps} actions, got ${steps.length}`,
    );
  }

  let current = state;
  for (const step of steps) {
    if (current.run.status !== "playing") {
      break;
    }
    current = applyProgramStep(current, pieceId, step);
  }
  if (current.run.status === "playing" && current.run.pendingUseItemId) {
    return {
      ...current,
      run: markLost(
        clearPendingUse(current.run),
        "You used an item but didn't move — path over",
      ),
    };
  }
  return current;
}

function applyCommitLoadout(state: GameState, itemIds: string[]): GameState {
  if (!isRunModeEnabled(state.definition) || state.run.status !== "playing") {
    return state;
  }
  if (state.run.inventory.length > 0) {
    return state;
  }

  const uniqueRequested = [...new Set(itemIds)];
  for (const id of uniqueRequested) {
    if (!state.items[id]) {
      throw new Error(`Unknown item id: ${id}`);
    }
    if (!state.stashItemIds.includes(id)) {
      return state;
    }
  }

  let stash = [...state.stashItemIds];
  for (const id of uniqueRequested) {
    const index = stash.indexOf(id);
    if (index < 0) {
      return state;
    }
    stash = [...stash.slice(0, index), ...stash.slice(index + 1)];
  }

  const inventory = [...uniqueRequested];
  const maxHp = effectiveMaxHp(state, inventory);
  return {
    ...state,
    stashItemIds: stash,
    run: {
      ...state.run,
      inventory,
      maxHp,
      hp: Math.min(state.run.hp, maxHp),
    },
  };
}

function applySoftReset(state: GameState): GameState {
  if (!isRunModeEnabled(state.definition)) {
    return state;
  }

  const runConfig = requireRunConfig(state.definition);
  const inventory: string[] = [];
  const maxHp = totalMaxHp(state.items, inventory, runConfig.maxHp);

  const cells: Record<string, TileState> = {};
  for (const [key, cell] of Object.entries(state.board.cells)) {
    const tileType = resolveTileType(state.board.tileTypes, cell.typeId);
    const effect = tileEffect(tileType);
    // Enemies and Mage refresh each attempt; powerups stay collected.
    if (
      (effect.kind === "enemy" || effect.kind === "mage") &&
      cell.resolved
    ) {
      cells[key] = { ...cell, resolved: false };
    } else {
      cells[key] = cell;
    }
  }

  return {
    ...state,
    board: { ...state.board, cells },
    pieces: state.pieces.map((p) =>
      p.id === runConfig.heroPieceId
        ? { ...p, position: { ...runConfig.startPosition } }
        : p,
    ),
    run: createRunState({
      maxHp,
      inventory,
      attempts: state.run.attempts + 1,
    }),
    stashItemIds: state.stashItemIds,
    coins: state.coins,
    claimedCoinKeys: [],
  };
}

export function createInitialState(definition: GameDefinition): GameState {
  if (isRunModeEnabled(definition) && !definition.run) {
    throw new Error(
      `Game definition "${definition.id}" has runMode enabled but no run config`,
    );
  }

  const board = createBoard(definition.board);
  const pieceTypes = createPieceTypeRegistry(definition.pieceTypes);
  const items = createItemRegistry(definition.items ?? []);
  const runConfig = defaultRunConfig(definition);

  for (const piece of definition.initialPieces) {
    if (!pieceTypes[piece.typeId]) {
      throw new Error(`Unknown piece type id: ${piece.typeId}`);
    }
    getCell(board, piece.position);
  }

  if (isRunModeEnabled(definition)) {
    const hero = definition.initialPieces.find((p) => p.id === runConfig.heroPieceId);
    if (!hero) {
      throw new Error(`Unknown hero piece id: ${runConfig.heroPieceId}`);
    }
    getCell(board, runConfig.startPosition);
  }

  // In run mode, start with the map hidden except the start cell and extractions.
  let cells = board.cells;
  if (isRunModeEnabled(definition)) {
    const startKey = coordKey(runConfig.startPosition);
    const next: Record<string, TileState> = {};
    for (const [key, cell] of Object.entries(cells)) {
      const type = resolveTileType(board.tileTypes, cell.typeId);
      const isExtraction = tileEffect(type).kind === "extraction";
      next[key] = {
        ...cell,
        isFaceUp: key === startKey || isExtraction,
        resolved: false,
      };
    }
    cells = next;
  }

  return {
    definition,
    board: { ...board, cells },
    pieceTypes,
    pieces: definition.initialPieces.map((p) => ({
      id: p.id,
      typeId: p.typeId,
      position: { ...p.position },
    })),
    items,
    run: createRunState({ maxHp: runConfig.maxHp }),
    stashItemIds: [],
    coins: 0,
    claimedCoinKeys: [],
  };
}

function withRerolledEdgeWallSeed(definition: GameDefinition): GameDefinition {
  if (!definition.board.edgeWalls) {
    return definition;
  }
  // Mix time into the roll so rapid New map clicks still diverge.
  const seed =
    (Math.floor(Math.random() * 0x1_0000_0000) ^
      (Date.now() & 0xffff_ffff)) >>>
    0;
  return {
    ...definition,
    board: {
      ...definition.board,
      edgeWalls: {
        ...definition.board.edgeWalls,
        seed,
      },
    },
  };
}

export function applyAction(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "flipTile": {
      if (!isTileFlipEnabled(state.definition)) {
        return state;
      }
      const key = coordKey(action.coord);
      const current = state.board.cells[key];
      if (!current) {
        throw new Error(
          `Cannot flip out-of-bounds cell (${action.coord.x}, ${action.coord.y})`,
        );
      }
      return {
        ...state,
        board: {
          ...state.board,
          cells: {
            ...state.board.cells,
            [key]: flipTileState(current),
          },
        },
      };
    }
    case "movePiece": {
      return {
        ...state,
        pieces: movePiece(
          state.pieces,
          action.pieceId,
          action.destination,
          state.board.grid,
        ),
      };
    }
    case "step":
      return applyStep(
        state,
        action.pieceId,
        action.destination,
        action.usedItemId,
      );
    case "programStep":
      return applyProgramStep(state, action.pieceId, action.step);
    case "runProgram":
      return applyRunProgram(state, action.pieceId, action.steps);
    case "commitLoadout":
      return applyCommitLoadout(state, action.itemIds);
    case "softReset":
      return applySoftReset(state);
    case "reset": {
      const definition =
        isRunModeEnabled(state.definition) && state.definition.board.edgeWalls
          ? withRerolledEdgeWallSeed(state.definition)
          : state.definition;
      return createInitialState(definition);
    }
    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}
