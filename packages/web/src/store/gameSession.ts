import {
  applyAction,
  createInitialState,
  isRunModeEnabled,
  type Coord,
  type GameAction,
  type GameDefinition,
  type GameState,
} from "@game-maker/engine";
import { useReducer } from "react";

export type InteractionMode = "flip" | "move" | "step";

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
  const runMode = isRunModeEnabled(definition);
  return {
    game: createInitialState(definition),
    mode: runMode ? "step" : "move",
    selectedPieceId: runMode
      ? (definition.run?.heroPieceId ?? null)
      : null,
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
        const clearsSelection =
          action.action.type === "reset" ||
          action.action.type === "movePiece" ||
          action.action.type === "softReset";
        const runMode = isRunModeEnabled(game.definition);
        const selectedPieceId = clearsSelection
          ? runMode
            ? (game.definition.run?.heroPieceId ?? null)
            : null
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
  if (isRunModeEnabled(state.game.definition) || state.mode === "step") {
    const heroId =
      state.game.definition.run?.heroPieceId ?? state.selectedPieceId;
    if (!heroId || state.game.run.status !== "playing") {
      return [];
    }
    return [
      {
        type: "game",
        action: { type: "step", pieceId: heroId, destination: coord },
      },
    ];
  }

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
