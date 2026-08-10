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
  resolveTileType,
  type TileState,
  type TileTypeDefinition,
  type TileTypeRegistry,
} from "../tiles/index.js";

export type CellOverride = {
  coord: Coord;
  typeId?: string;
  isFaceUp?: boolean;
};

export type BoardConfig = {
  grid: GridConfig;
  tileTypes: TileTypeDefinition[];
  defaultTileTypeId: string;
  overrides?: CellOverride[];
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
    );
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
