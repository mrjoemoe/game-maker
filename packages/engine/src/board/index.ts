import {
  allCoords,
  coordKey,
  createGrid,
  type Coord,
  type GridConfig,
} from "../grid/index.js";
import {
  createTileState,
  createTileTypeRegistry,
  createSeededRandom,
  generateConnectedEdgeWalls,
  resolveTileType,
  type EdgeWallConfig,
  type TileState,
  type TileTypeDefinition,
  type TileTypeRegistry,
} from "../tiles/index.js";

export type CellOverride = {
  coord: Coord;
  typeId?: string;
  isFaceUp?: boolean;
};

/** Place a tile type on one random eligible cell (seeded via edgeWalls.seed). */
export type RandomTilePlacement = {
  typeId: string;
  /** Only replace cells currently of this type. Defaults to defaultTileTypeId. */
  onTypeId?: string;
  /** Cells that must not receive this placement. */
  exclude?: Coord[];
  /** How many cells to place (default 1). */
  count?: number;
};

export type BoardConfig = {
  grid: GridConfig;
  tileTypes: TileTypeDefinition[];
  defaultTileTypeId: string;
  overrides?: CellOverride[];
  /**
   * When set, places exactly `count` undirected edge walls between cells
   * without disconnecting the map.
   */
  edgeWalls?: EdgeWallConfig;
  /** Optional seeded one-off placements (e.g. random castle). Applied last. */
  randomPlacements?: RandomTilePlacement[];
  /**
   * When set, after tiles/walls/placements, each cell gets a coin stack using
   * these probabilities for 0/1/2/3 coins (must sum > 0).
   */
  coinWeights?: { zero: number; one: number; two: number; three: number };
};

function rollCoinCount(
  random: () => number,
  weights: { zero: number; one: number; two: number; three: number },
): 0 | 1 | 2 | 3 {
  const total = weights.zero + weights.one + weights.two + weights.three;
  const roll = random() * total;
  if (roll < weights.zero) return 0;
  if (roll < weights.zero + weights.one) return 1;
  if (roll < weights.zero + weights.one + weights.two) return 2;
  return 3;
}

export type Board = {
  grid: GridConfig;
  tileTypes: TileTypeRegistry;
  cells: Record<string, TileState>;
  /** Undirected edge walls between adjacent cells. */
  edgeWalls: string[];
};

export function createBoard(config: BoardConfig): Board {
  const grid = createGrid(config.grid);
  const tileTypes = createTileTypeRegistry(config.tileTypes);
  resolveTileType(tileTypes, config.defaultTileTypeId);

  const cells: Record<string, TileState> = {};
  for (const coord of allCoords(grid)) {
    cells[coordKey(coord)] = createTileState(config.defaultTileTypeId, true);
  }

  for (const override of config.overrides ?? []) {
    const key = coordKey(override.coord);
    if (!(key in cells)) {
      throw new Error(
        `Override out of bounds: (${override.coord.x}, ${override.coord.y})`,
      );
    }
    const typeId = override.typeId ?? cells[key].typeId;
    resolveTileType(tileTypes, typeId);
    cells[key] = createTileState(
      typeId,
      override.isFaceUp ?? cells[key].isFaceUp,
      cells[key].resolved ?? false,
      cells[key].coins ?? 0,
    );
  }

  const edgeWalls = config.edgeWalls
    ? generateConnectedEdgeWalls(grid, config.edgeWalls)
    : [];

  if (config.randomPlacements && config.randomPlacements.length > 0) {
    const seed = config.edgeWalls?.seed ?? 0;
    const rng = createSeededRandom((seed ^ 0xc4571e) >>> 0);
    for (const placement of config.randomPlacements) {
      resolveTileType(tileTypes, placement.typeId);
      const onTypeId = placement.onTypeId ?? config.defaultTileTypeId;
      const excluded = new Set(
        (placement.exclude ?? []).map((c) => coordKey(c)),
      );
      const count = Math.max(1, placement.count ?? 1);
      for (let n = 0; n < count; n += 1) {
        const candidates = allCoords(grid).filter((coord) => {
          const key = coordKey(coord);
          if (excluded.has(key)) {
            return false;
          }
          return cells[key]?.typeId === onTypeId;
        });
        if (candidates.length === 0) {
          throw new Error(
            `No eligible cells to place random tile "${placement.typeId}" (${n}/${count})`,
          );
        }
        const pick = candidates[Math.floor(rng() * candidates.length)]!;
        const key = coordKey(pick);
        const current = cells[key]!;
        cells[key] = createTileState(
          placement.typeId,
          current.isFaceUp,
          current.resolved ?? false,
          current.coins ?? 0,
        );
      }
    }
  }

  if (config.coinWeights) {
    const seed = config.edgeWalls?.seed ?? 0;
    const rng = createSeededRandom((seed ^ 0xc01a5) >>> 0);
    for (const key of Object.keys(cells)) {
      const current = cells[key]!;
      cells[key] = {
        ...current,
        coins: rollCoinCount(rng, config.coinWeights),
      };
    }
  }

  return { grid, tileTypes, cells, edgeWalls };
}

export function getCell(board: Board, coord: Coord): TileState {
  const tile = board.cells[coordKey(coord)];
  if (!tile) {
    throw new Error(`No cell at (${coord.x}, ${coord.y})`);
  }
  return tile;
}
