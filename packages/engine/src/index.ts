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
  tileEffect,
  type TileEffect,
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
  createItemRegistry,
  resolveItem,
  totalAttack,
  totalMaxHp,
  type ItemDefinition,
  type ItemRegistry,
} from "./items/index.js";

export {
  applyDamage,
  collectItem,
  createRunState,
  markWon,
  type CreateRunStateOptions,
  type RunState,
  type RunStatus,
} from "./run/index.js";

export {
  applyAction,
  createInitialState,
  isRunModeEnabled,
  isTileFlipEnabled,
  type GameAction,
  type GameDefinition,
  type GameFeatures,
  type GameState,
  type InitialPiece,
  type RunConfig,
} from "./game/index.js";
