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
  DIRECTIONS,
  destinationFrom,
  directionDelta,
  directionLabel,
  type Direction,
} from "./grid/directions.js";

export {
  canPassWithItem,
  createTileState,
  createTileTypeRegistry,
  flipTileState,
  generateSideWalls,
  isCrossingBlocked,
  normalizeWalls,
  oppositeSide,
  resolveTileType,
  sideToward,
  tileEffect,
  tileHasWall,
  TILE_SIDES,
  type SideWallConfig,
  type SideWallWeights,
  type TileEffect,
  type TileSide,
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
  type RandomTilePlacement,
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
  programActionLabel,
  setBump,
  SHOP_ITEM_COST,
  type CreateRunStateOptions,
  type ProgramAction,
  type ProgramStep,
  type RunState,
  type RunStatus,
} from "./run/index.js";

export {
  applyAction,
  createInitialState,
  isRunModeEnabled,
  isTileFlipEnabled,
  runProgramLength,
  type GameAction,
  type GameDefinition,
  type GameFeatures,
  type GameState,
  type InitialPiece,
  type RunConfig,
} from "./game/index.js";
