import {
  applyAction,
  createInitialState,
  type Coord,
  type GameAction,
  type GameDefinition,
  type GameState,
} from "@game-maker/engine";
import { useReducer } from "react";

export type InteractionMode = "flip" | "move";

export type UiState = {
  game: GameState;
  mode: InteractionMode;
  selectedPieceId: string | null;
};

export type UiAction =
  | { type: "setMode"; mode: InteractionMode }
  | { type: "selectPiece"; pieceId: string | null }
  | { type: "game"; action: GameAction };

export function createUiState(definition: GameDefinition): UiState {
  return {
    game: createInitialState(definition),
    mode: "move",
    selectedPieceId: null,
  };
}

export function uiReducer(state: UiState, action: UiAction): UiState {
  switch (action.type) {
    case "setMode":
      return { ...state, mode: action.mode, selectedPieceId: null };
    case "selectPiece":
      return { ...state, selectedPieceId: action.pieceId };
    case "game": {
      try {
        const game = applyAction(state.game, action.action);
        const selectedPieceId =
          action.action.type === "reset" || action.action.type === "movePiece"
            ? null
            : state.selectedPieceId;
        return { ...state, game, selectedPieceId };
      } catch {
        return state;
      }
    }
    default:
      return state;
  }
}

export function useGameSession(definition: GameDefinition) {
  return useReducer(uiReducer, definition, createUiState);
}

export function cellClicked(
  state: UiState,
  coord: Coord,
  pieceIdAtCell: string | undefined,
): UiAction[] {
  if (state.mode === "flip") {
    return [{ type: "game", action: { type: "flipTile", coord } }];
  }

  if (pieceIdAtCell) {
    if (state.selectedPieceId === pieceIdAtCell) {
      return [{ type: "selectPiece", pieceId: null }];
    }
    return [{ type: "selectPiece", pieceId: pieceIdAtCell }];
  }

  if (state.selectedPieceId) {
    return [
      {
        type: "game",
        action: {
          type: "movePiece",
          pieceId: state.selectedPieceId,
          destination: coord,
        },
      },
    ];
  }

  return [];
}
