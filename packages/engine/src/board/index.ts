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

  return { grid, tileTypes, cells };
}

export function getCell(board: Board, coord: Coord): TileState {
  const tile = board.cells[coordKey(coord)];
  if (!tile) {
    throw new Error(`No cell at (${coord.x}, ${coord.y})`);
  }
  return tile;
}
