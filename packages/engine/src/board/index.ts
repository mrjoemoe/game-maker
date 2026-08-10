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
  generateSideWalls,
  resolveTileType,
  type SideWallConfig,
  type TileSide,
  type TileState,
  type TileTypeDefinition,
  type TileTypeRegistry,
} from "../tiles/index.js";

export type CellOverride = {
  coord: Coord;
  typeId?: string;
  isFaceUp?: boolean;
  /** Explicit side walls for this cell (skips random generation for the cell). */
  walls?: TileSide[];
};

/** Place a tile type on one random eligible cell (seeded via sideWalls.seed). */
export type RandomTilePlacement = {
  typeId: string;
  /** Only replace cells currently of this type. Defaults to defaultTileTypeId. */
  onTypeId?: string;
  /** Cells that must not receive this placement. */
  exclude?: Coord[];
  /** When set, replaces walls on the placed cell. */
  walls?: TileSide[];
};

export type BoardConfig = {
  grid: GridConfig;
  tileTypes: TileTypeDefinition[];
  defaultTileTypeId: string;
  overrides?: CellOverride[];
  /**
   * When set, most tiles get 0 side walls, some get 1, few get 2, in random
   * orientations. Per-cell `walls` overrides win over generation.
   */
  sideWalls?: SideWallConfig;
  /** Optional seeded one-off placements (e.g. random castle). Applied last. */
  randomPlacements?: RandomTilePlacement[];
};

export type Board = {
  grid: GridConfig;
  tileTypes: TileTypeRegistry;
  cells: Record<string, TileState>;
};

export function createBoard(config: BoardConfig): Board {
  const grid = createGrid(config.grid);
  const tileTypes = createTileTypeRegistry(config.tileTypes);
  resolveTileType(tileTypes, config.defaultTileTypeId);

  const cells: Record<string, TileState> = {};
  for (const coord of allCoords(grid)) {
    cells[coordKey(coord)] = createTileState(config.defaultTileTypeId, true);
  }

  const explicitWallKeys = new Set<string>();

  for (const override of config.overrides ?? []) {
    const key = coordKey(override.coord);
    if (!(key in cells)) {
      throw new Error(
        `Override out of bounds: (${override.coord.x}, ${override.coord.y})`,
      );
    }
    const typeId = override.typeId ?? cells[key].typeId;
    resolveTileType(tileTypes, typeId);
    const walls = override.walls ?? cells[key].walls ?? [];
    if (override.walls) {
      explicitWallKeys.add(key);
    }
    cells[key] = createTileState(
      typeId,
      override.isFaceUp ?? cells[key].isFaceUp,
      cells[key].resolved ?? false,
      walls,
    );
  }

  if (config.sideWalls) {
    const generated = generateSideWalls(Object.keys(cells), config.sideWalls);
    for (const [key, walls] of Object.entries(generated)) {
      if (explicitWallKeys.has(key)) {
        continue;
      }
      const current = cells[key];
      cells[key] = createTileState(
        current.typeId,
        current.isFaceUp,
        current.resolved ?? false,
        walls,
      );
    }
  }

  if (config.randomPlacements && config.randomPlacements.length > 0) {
    const seed = config.sideWalls?.seed ?? 0;
    const rng = createSeededRandom((seed ^ 0xc4571e) >>> 0);
    for (const placement of config.randomPlacements) {
      resolveTileType(tileTypes, placement.typeId);
      const onTypeId = placement.onTypeId ?? config.defaultTileTypeId;
      const excluded = new Set(
        (placement.exclude ?? []).map((c) => coordKey(c)),
      );
      const candidates = allCoords(grid).filter((coord) => {
        const key = coordKey(coord);
        if (excluded.has(key)) {
          return false;
        }
        return cells[key]?.typeId === onTypeId;
      });
      if (candidates.length === 0) {
        throw new Error(
          `No eligible cells to place random tile "${placement.typeId}"`,
        );
      }
      const pick = candidates[Math.floor(rng() * candidates.length)]!;
      const key = coordKey(pick);
      const current = cells[key]!;
      cells[key] = createTileState(
        placement.typeId,
        current.isFaceUp,
        current.resolved ?? false,
        placement.walls ?? current.walls ?? [],
      );
    }
  }

  return { grid, tileTypes, cells };
}

export function getCell(board: Board, coord: Coord): TileState {
  const tile = board.cells[coordKey(coord)];
  if (!tile) {
    throw new Error(`No cell at (${coord.x}, ${coord.y})`);
  }
  return tile;
}
