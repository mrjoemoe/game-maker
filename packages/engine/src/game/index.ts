import { createBoard, getCell, type Board, type BoardConfig } from "../board/index.js";
import {
  destinationFrom,
  type Direction,
} from "../grid/directions.js";
import { coordKey, isInBounds, neighbors, type Coord } from "../grid/index.js";
import {
  createItemRegistry,
  totalAttack,
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
  applyDamage,
  clearBump,
  collectItem,
  createRunState,
  isSafePathEffect,
  markLost,
  markWon,
  pathOverMessage,
  setBump,
  type RunState,
} from "../run/index.js";
import {
  canPassWithItem,
  flipTileState,
  isCrossingBlocked,
  resolveTileType,
  sideToward,
  tileEffect,
  tileHasWall,
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
  /** Exact number of moves the player must chart before executing. Defaults to 6. */
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
  return definition.run?.programLength ?? 6;
}

export type GameState = {
  definition: GameDefinition;
  board: Board;
  pieceTypes: PieceTypeRegistry;
  pieces: PieceInstance[];
  items: ItemRegistry;
  run: RunState;
  /** Items found across attempts; seeded into inventory on softReset. */
  discoveredItemIds: string[];
};

export type GameAction =
  | { type: "flipTile"; coord: Coord }
  | { type: "movePiece"; pieceId: string; destination: Coord }
  | { type: "step"; pieceId: string; destination: Coord }
  | { type: "runProgram"; pieceId: string; steps: Direction[] }
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

function addDiscovered(ids: string[], itemId: string): string[] {
  return ids.includes(itemId) ? ids : [...ids, itemId];
}

function grantItem(
  run: RunState,
  discovered: string[],
  itemId: string,
  items: ItemRegistry,
): { run: RunState; discovered: string[] } {
  if (!items[itemId]) {
    throw new Error(`Unknown item id: ${itemId}`);
  }
  return {
    run: collectItem(run, itemId),
    discovered: addDiscovered(discovered, itemId),
  };
}

function effectiveMaxHp(state: GameState, inventory: string[]): number {
  const runConfig = defaultRunConfig(state.definition);
  return totalMaxHp(state.items, inventory, runConfig.maxHp);
}

function resolveStepEffects(
  state: GameState,
  destination: Coord,
  cells: Record<string, TileState>,
  run: RunState,
  discovered: string[],
): { cells: Record<string, TileState>; run: RunState; discovered: string[] } {
  const key = coordKey(destination);
  const cell = cells[key];
  if (!cell) {
    return { cells, run, discovered };
  }

  const tileType = resolveTileType(state.board.tileTypes, cell.typeId);
  const effect = tileEffect(tileType);

  if (cell.resolved && (effect.kind === "enemy" || effect.kind === "powerup")) {
    return { cells, run, discovered };
  }

  switch (effect.kind) {
    case "empty":
    case "wall":
      return { cells, run, discovered };
    case "trap": {
      const nextRun = applyDamage(run, effect.damage);
      return { cells, run: nextRun, discovered };
    }
    case "enemy": {
      const runConfig = defaultRunConfig(state.definition);
      const attack = totalAttack(state.items, run.inventory, runConfig.baseAttack);
      if (attack >= effect.power) {
        let nextCells = markResolved(cells, key);
        let nextRun = run;
        let nextDiscovered = discovered;
        if (effect.rewardItemId) {
          const granted = grantItem(nextRun, nextDiscovered, effect.rewardItemId, state.items);
          nextRun = granted.run;
          nextDiscovered = granted.discovered;
          nextRun = {
            ...nextRun,
            maxHp: effectiveMaxHp(state, nextRun.inventory),
            hp: Math.min(nextRun.hp, effectiveMaxHp(state, nextRun.inventory)),
          };
        }
        return { cells: nextCells, run: nextRun, discovered: nextDiscovered };
      }
      return { cells, run: applyDamage(run, effect.damage), discovered };
    }
    case "powerup": {
      const granted = grantItem(run, discovered, effect.itemId, state.items);
      const maxHp = effectiveMaxHp(state, granted.run.inventory);
      return {
        cells: markResolved(cells, key),
        run: {
          ...granted.run,
          maxHp,
          // Collecting a maxHp bonus tops up current HP to the new max.
          hp: Math.max(granted.run.hp, maxHp),
        },
        discovered: granted.discovered,
      };
    }
    case "goal":
      return { cells, run: markWon(run), discovered };
    default: {
      const _exhaustive: never = effect;
      return _exhaustive;
    }
  }
}

function applyStep(state: GameState, pieceId: string, destination: Coord): GameState {
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

  const fromCell = state.board.cells[coordKey(piece.position)];
  const destCell = state.board.cells[coordKey(destination)];
  if (
    fromCell &&
    destCell &&
    isCrossingBlocked(fromCell.walls, destCell.walls, piece.position, destination)
  ) {
    // Reveal the destination, stay put, path ends — walls are not safe terrain.
    const key = coordKey(destination);
    const cells = revealCell(state.board.cells, key);
    const exit = sideToward(piece.position, destination);
    const blockedOnOrigin =
      exit !== null && tileHasWall(fromCell.walls, exit);
    const message = blockedOnOrigin
      ? "You hit a wall on this tile — path over"
      : "You hit a wall on the next tile — path over";
    return {
      ...state,
      board: { ...state.board, cells },
      run: markLost(state.run, message),
    };
  }

  const key = coordKey(destination);
  let cells = revealCell(state.board.cells, key);
  const cell = cells[key];
  const tileType = resolveTileType(state.board.tileTypes, cell.typeId);
  const effect = tileEffect(tileType);
  const holdingPassItem = canPassWithItem(tileType, state.run.inventory);

  // Pass item: traverse rough terrain (goal wins).
  if (holdingPassItem && (effect.kind === "wall" || !isSafePathEffect(effect.kind))) {
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
      run: effect.kind === "goal" ? markWon(state.run) : clearBump(state.run),
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

  // Only meadow/forest (empty) are safe. Anything else ends the path as a loss.
  if (!isSafePathEffect(effect.kind)) {
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
      run: markLost(state.run, pathOverMessage(tileType.label)),
    };
  }

  const pieces = movePiece(state.pieces, pieceId, destination, state.board.grid);
  return {
    ...state,
    board: { ...state.board, cells },
    pieces,
    run: clearBump(state.run),
  };
}

/**
 * Execute a locked-in list of orthogonal moves in order. Stops early if the
 * run ends (won/lost). Out-of-bounds moves are wasted (hero stays put).
 */
function applyRunProgram(
  state: GameState,
  pieceId: string,
  steps: Direction[],
): GameState {
  if (!isRunModeEnabled(state.definition) || state.run.status !== "playing") {
    return state;
  }

  const expected = runProgramLength(state.definition);
  if (steps.length !== expected) {
    throw new Error(
      `Program must contain exactly ${expected} steps, got ${steps.length}`,
    );
  }

  let current = state;
  for (const direction of steps) {
    if (current.run.status !== "playing") {
      break;
    }
    const piece = current.pieces.find((p) => p.id === pieceId);
    if (!piece) {
      throw new Error(`Unknown piece id: ${pieceId}`);
    }
    const destination = destinationFrom(piece.position, direction);
    if (!isInBounds(current.board.grid, destination)) {
      continue;
    }
    current = applyStep(current, pieceId, destination);
  }
  return current;
}

function applySoftReset(state: GameState): GameState {
  if (!isRunModeEnabled(state.definition)) {
    return state;
  }

  const runConfig = requireRunConfig(state.definition);
  const inventory = [...state.discoveredItemIds];
  const maxHp = totalMaxHp(state.items, inventory, runConfig.maxHp);

  const cells: Record<string, TileState> = {};
  for (const [key, cell] of Object.entries(state.board.cells)) {
    const tileType = resolveTileType(state.board.tileTypes, cell.typeId);
    const effect = tileEffect(tileType);
    // Enemies respawn; other resolved one-shots (powerups) stay collected.
    if (effect.kind === "enemy" && cell.resolved) {
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
    discoveredItemIds: state.discoveredItemIds,
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

  // In run mode, start with the map hidden except the start cell.
  let cells = board.cells;
  if (isRunModeEnabled(definition)) {
    const startKey = coordKey(runConfig.startPosition);
    const next: Record<string, TileState> = {};
    for (const [key, cell] of Object.entries(cells)) {
      next[key] = {
        ...cell,
        isFaceUp: key === startKey,
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
    discoveredItemIds: [],
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
      return applyStep(state, action.pieceId, action.destination);
    case "runProgram":
      return applyRunProgram(state, action.pieceId, action.steps);
    case "softReset":
      return applySoftReset(state);
    case "reset":
      return createInitialState(state.definition);
    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}
