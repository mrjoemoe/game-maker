/**
 * Optional gameplay effect a tile type triggers when a hero steps onto it in
 * run mode. Effects are static config on the tile type; per-cell "already
 * happened" state lives on {@link TileState.resolved}.
 */
export type TileEffect =
  | { kind: "empty" }
  | { kind: "wall" }
  | { kind: "trap"; damage: number }
  | { kind: "enemy"; power: number; damage: number; rewardItemId?: string }
  | { kind: "powerup"; itemId: string }
  | { kind: "goal" };

export type { TileSide, SideWallConfig, SideWallWeights } from "./sides.js";
export {
  TILE_SIDES,
  createSeededRandom,
  generateSideWalls,
  isCrossingBlocked,
  normalizeWalls,
  oppositeSide,
  sideToward,
  tileHasWall,
} from "./sides.js";

import { normalizeWalls, type TileSide } from "./sides.js";

export type TileTypeDefinition = {
  id: string;
  label: string;
  color: string;
  /** Optional run-mode effect triggered on step. Defaults to inert (empty). */
  effect?: TileEffect;
  /** Optional free-form metadata for prototypes. */
  props?: Record<string, unknown>;
};

export type TileState = {
  typeId: string;
  isFaceUp: boolean;
  /** True once a one-shot effect (enemy/powerup) on this cell has fired. */
  resolved?: boolean;
  /** Orthogonal sides of this tile that are blocked by a wall (0–4). */
  walls?: TileSide[];
};

export type TileTypeRegistry = Record<string, TileTypeDefinition>;

export function createTileTypeRegistry(
  types: TileTypeDefinition[],
): TileTypeRegistry {
  if (types.length === 0) {
    throw new Error("At least one tile type is required");
  }
  const registry: TileTypeRegistry = {};
  for (const type of types) {
    if (registry[type.id]) {
      throw new Error(`Duplicate tile type id: ${type.id}`);
    }
    registry[type.id] = type;
  }
  return registry;
}

export function resolveTileType(
  registry: TileTypeRegistry,
  typeId: string,
): TileTypeDefinition {
  const type = registry[typeId];
  if (!type) {
    throw new Error(`Unknown tile type id: ${typeId}`);
  }
  return type;
}

export function createTileState(
  typeId: string,
  isFaceUp = true,
  resolved = false,
  walls: TileSide[] = [],
): TileState {
  return { typeId, isFaceUp, resolved, walls: normalizeWalls(walls) };
}

export function flipTileState(tile: TileState): TileState {
  return { ...tile, isFaceUp: !tile.isFaceUp };
}

/** The effect for a tile type, defaulting to inert when none is declared. */
export function tileEffect(type: TileTypeDefinition): TileEffect {
  return type.effect ?? { kind: "empty" };
}
