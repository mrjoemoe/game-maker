import { createInitialState, type GameDefinition } from "@game-maker/engine";
import { describe, expect, it } from "vitest";
import { cellClicked, createUiState } from "./gameSession.ts";

const sandbox: GameDefinition = {
  id: "sandbox",
  name: "Sandbox",
  templateId: "tile-board",
  board: {
    grid: { width: 2, height: 2 },
    tileTypes: [{ id: "grass", label: "Grass", color: "#4caf50" }],
    defaultTileTypeId: "grass",
  },
  pieceTypes: [{ id: "token", label: "Token", color: "#ff9800" }],
  initialPieces: [{ id: "t1", typeId: "token", position: { x: 0, y: 0 } }],
};

describe("cellClicked", () => {
  it("selects then moves a sandbox piece", () => {
    const state = createUiState(sandbox);
    const select = cellClicked(state, { x: 0, y: 0 }, "t1");
    expect(select).toEqual([{ type: "selectPiece", pieceId: "t1" }]);
    const selected = { ...state, selectedPieceId: "t1" };
    const move = cellClicked(selected, { x: 1, y: 1 }, undefined);
    expect(move).toEqual([
      {
        type: "game",
        action: {
          type: "movePiece",
          pieceId: "t1",
          destination: { x: 1, y: 1 },
        },
      },
    ]);
  });

  it("does not step from board clicks in run mode", () => {
    const definition: GameDefinition = {
      ...sandbox,
      id: "run-sandbox",
      features: { runMode: true },
      run: {
        heroPieceId: "t1",
        startPosition: { x: 0, y: 0 },
        maxHp: 10,
        baseAttack: 1,
      },
    };
    const state = {
      game: createInitialState(definition),
      mode: "step" as const,
      selectedPieceId: "t1",
    };
    expect(cellClicked(state, { x: 1, y: 0 }, undefined)).toEqual([]);
  });
});
