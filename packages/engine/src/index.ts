export {
  allCoords,
  coordKey,
  createGrid,
  isInBounds,
  neighbors,
  parseCoordKey,
  type Coord,
  type GridConfig,
} from "./grid/index.js";

export {
  createTileState,
  createTileTypeRegistry,
  flipTileState,
  resolveTileType,
  type TileState,
  type TileTypeDefinition,
  type TileTypeRegistry,
} from "./tiles/index.js";

export {
  createBoard,
  getCell,
  type Board,
  type BoardConfig,
  type CellOverride,
} from "./board/index.js";

export {
  createPieceTypeRegistry,
  movePiece,
  pieceAt,
  type PieceInstance,
  type PieceTypeDefinition,
  type PieceTypeRegistry,
} from "./pieces/index.js";

export {
  applyAction,
  createInitialState,
  isTileFlipEnabled,
  type GameAction,
  type GameDefinition,
  type GameFeatures,
  type GameState,
  type InitialPiece,
} from "./game/index.js";
