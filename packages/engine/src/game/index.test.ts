import { describe, expect, it } from "vitest";
import { applyAction, createInitialState, type GameDefinition } from "./index.js";
import { getCell } from "../board/index.js";

const definition: GameDefinition = {
  id: "test",
  name: "Test",
  templateId: "tile-board",
  board: {
    grid: { width: 2, height: 2 },
    tileTypes: [
      { id: "grass", label: "Grass", color: "#4caf50" },
      { id: "water", label: "Water", color: "#2196f3" },
    ],
    defaultTileTypeId: "grass",
    overrides: [{ coord: { x: 0, y: 0 }, typeId: "water", isFaceUp: false }],
  },
  pieceTypes: [{ id: "token", label: "Token", color: "#ff9800" }],
  initialPieces: [{ id: "t1", typeId: "token", position: { x: 1, y: 1 } }],
};

describe("game", () => {
  it("creates initial state from definition", () => {
    const state = createInitialState(definition);
    expect(getCell(state.board, { x: 0, y: 0 }).isFaceUp).toBe(false);
    expect(state.pieces[0].position).toEqual({ x: 1, y: 1 });
  });

  it("flips tiles and moves pieces, then resets", () => {
    let state = createInitialState(definition);
    state = applyAction(state, { type: "flipTile", coord: { x: 0, y: 0 } });
    expect(getCell(state.board, { x: 0, y: 0 }).isFaceUp).toBe(true);

    state = applyAction(state, {
      type: "movePiece",
      pieceId: "t1",
      destination: { x: 0, y: 1 },
    });
    expect(state.pieces[0].position).toEqual({ x: 0, y: 1 });

    state = applyAction(state, { type: "reset" });
    expect(getCell(state.board, { x: 0, y: 0 }).isFaceUp).toBe(false);
    expect(state.pieces[0].position).toEqual({ x: 1, y: 1 });
  });

  it("rejects out-of-bounds moves without changing state when not applied", () => {
    const state = createInitialState(definition);
    expect(() =>
      applyAction(state, {
        type: "movePiece",
        pieceId: "t1",
        destination: { x: 5, y: 5 },
      }),
    ).toThrow(/out of bounds/);
    expect(state.pieces[0].position).toEqual({ x: 1, y: 1 });
  });

  it("ignores flip when tileFlip feature is disabled", () => {
    const noFlip: GameDefinition = {
      ...definition,
      features: { tileFlip: false },
    };
    let state = createInitialState(noFlip);
    expect(getCell(state.board, { x: 0, y: 0 }).isFaceUp).toBe(false);
    state = applyAction(state, { type: "flipTile", coord: { x: 0, y: 0 } });
    expect(getCell(state.board, { x: 0, y: 0 }).isFaceUp).toBe(false);
  });
});
