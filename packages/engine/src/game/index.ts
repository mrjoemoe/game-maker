import { createBoard, getCell, type Board, type BoardConfig } from "../board/index.js";
import { coordKey, type Coord } from "../grid/index.js";
import {
  createPieceTypeRegistry,
  movePiece,
  type PieceInstance,
  type PieceTypeDefinition,
  type PieceTypeRegistry,
} from "../pieces/index.js";
import { flipTileState } from "../tiles/index.js";

export type InitialPiece = {
  id: string;
  typeId: string;
  position: Coord;
};

export type GameFeatures = {
  /** When false, flipTile actions leave face state unchanged. Defaults to true. */
  tileFlip?: boolean;
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
};

export function isTileFlipEnabled(definition: GameDefinition): boolean {
  return definition.features?.tileFlip !== false;
}

export type GameState = {
  definition: GameDefinition;
  board: Board;
  pieceTypes: PieceTypeRegistry;
  pieces: PieceInstance[];
};

export type GameAction =
  | { type: "flipTile"; coord: Coord }
  | { type: "movePiece"; pieceId: string; destination: Coord }
  | { type: "reset" };

export function createInitialState(definition: GameDefinition): GameState {
  const board = createBoard(definition.board);
  const pieceTypes = createPieceTypeRegistry(definition.pieceTypes);

  for (const piece of definition.initialPieces) {
    if (!pieceTypes[piece.typeId]) {
      throw new Error(`Unknown piece type id: ${piece.typeId}`);
    }
    getCell(board, piece.position);
  }

  return {
    definition,
    board,
    pieceTypes,
    pieces: definition.initialPieces.map((p) => ({
      id: p.id,
      typeId: p.typeId,
      position: { ...p.position },
    })),
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
    case "reset":
      return createInitialState(state.definition);
    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}
