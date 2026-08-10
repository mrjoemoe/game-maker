import { describe, expect, it } from "vitest";
import { applyAction, createInitialState } from "./index.js";
import { getCell } from "../board/index.js";
import { tileEffect } from "../tiles/index.js";
import { goblinWoods } from "../../../../prototypes/goblin-woods/config/game.config.js";

describe("goblin woods stash extraction smoke", () => {
  it("has face-up corner extraction and one castle off start/corners", () => {
    const state = createInitialState(goblinWoods);
    const corners = [
      { x: 0, y: 0 },
      { x: 6, y: 0 },
      { x: 0, y: 6 },
      { x: 6, y: 6 },
    ];
    for (const c of corners) {
      const cell = getCell(state.board, c);
      expect(cell.isFaceUp).toBe(true);
      expect(tileEffect(state.board.tileTypes[cell.typeId]!).kind).toBe("extraction");
    }
    const castles = Object.values(state.board.cells).filter((c) => c.typeId === "castle");
    expect(castles).toHaveLength(1);
  });

  it("banks a Mage take on extract", () => {
    let state = createInitialState(goblinWoods);
    state = applyAction(state, {
      type: "programStep",
      pieceId: "hero",
      step: { action: { kind: "takeFromMage", itemId: "knife" }, move: "left" },
    });
    state = applyAction(state, {
      type: "programStep",
      pieceId: "hero",
      step: { action: { kind: "none" }, move: "left" },
    });
    state = applyAction(state, {
      type: "programStep",
      pieceId: "hero",
      step: { action: { kind: "none" }, move: "left" },
    });
    state = applyAction(state, {
      type: "programStep",
      pieceId: "hero",
      step: { action: { kind: "none" }, move: "left" },
    });
    expect(state.pieces[0].position).toEqual({ x: 0, y: 6 });
    expect(state.run.status).toBe("extracted");
    expect(state.stashItemIds).toEqual(["knife"]);
    expect(state.run.inventory).toEqual([]);
  });
});
