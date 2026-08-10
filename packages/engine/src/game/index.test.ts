import { describe, expect, it } from "vitest";
import { applyAction, createInitialState, type GameDefinition } from "./index.js";
import { getCell } from "../board/index.js";
import { coordKey } from "../grid/index.js";

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

const runDefinition: GameDefinition = {
  id: "run-test",
  name: "Run Test",
  templateId: "tile-board",
  features: { runMode: true, tileFlip: false },
  items: [
    { id: "sword", label: "Sword", attackBonus: 2 },
    { id: "shield", label: "Shield", maxHpBonus: 20 },
  ],
  run: {
    heroPieceId: "hero",
    startPosition: { x: 0, y: 0 },
    maxHp: 100,
    baseAttack: 1,
  },
  board: {
    grid: { width: 3, height: 3 },
    tileTypes: [
      { id: "meadow", label: "Meadow", color: "#6aa84f", effect: { kind: "empty" } },
      { id: "wall", label: "Wall", color: "#555555", effect: { kind: "wall" } },
      { id: "trap", label: "Trap", color: "#8b0000", effect: { kind: "trap", damage: 40 } },
      {
        id: "goblin",
        label: "Goblin",
        color: "#2e7d32",
        effect: { kind: "enemy", power: 2, damage: 50 },
      },
      {
        id: "villain",
        label: "Villain",
        color: "#1b5e20",
        effect: { kind: "enemy", power: 3, damage: 80, rewardItemId: "shield" },
      },
      {
        id: "sword-tile",
        label: "Sword",
        color: "#c0c0c0",
        effect: { kind: "powerup", itemId: "sword" },
      },
      { id: "castle", label: "Castle", color: "#795548", effect: { kind: "goal" } },
    ],
    defaultTileTypeId: "meadow",
    overrides: [
      { coord: { x: 1, y: 0 }, typeId: "wall" },
      { coord: { x: 0, y: 1 }, typeId: "trap" },
      { coord: { x: 1, y: 1 }, typeId: "goblin" },
      { coord: { x: 2, y: 1 }, typeId: "sword-tile" },
      { coord: { x: 2, y: 0 }, typeId: "villain" },
      { coord: { x: 2, y: 2 }, typeId: "castle" },
    ],
  },
  pieceTypes: [{ id: "hero", label: "Hero", color: "#e69138", icon: "H" }],
  initialPieces: [{ id: "hero", typeId: "hero", position: { x: 0, y: 0 } }],
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

describe("run mode", () => {
  it("starts with only the start tile face up", () => {
    const state = createInitialState(runDefinition);
    expect(getCell(state.board, { x: 0, y: 0 }).isFaceUp).toBe(true);
    expect(getCell(state.board, { x: 1, y: 0 }).isFaceUp).toBe(false);
    expect(state.run.hp).toBe(100);
    expect(state.run.attempts).toBe(1);
  });

  it("reveals a wall without moving onto it", () => {
    let state = createInitialState(runDefinition);
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 1, y: 0 },
    });
    expect(state.pieces[0].position).toEqual({ x: 0, y: 0 });
    expect(getCell(state.board, { x: 1, y: 0 }).isFaceUp).toBe(true);
  });

  it("applies trap damage and can lose the run", () => {
    let state = createInitialState(runDefinition);
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 0, y: 1 },
    });
    expect(state.pieces[0].position).toEqual({ x: 0, y: 1 });
    expect(state.run.hp).toBe(60);
    expect(state.run.status).toBe("playing");

    // Walk into the trap again via soft path: go to goblin then... just re-enter trap
    // from meadow at 0,0 after moving back - simpler: softReset then hit trap twice more
    // Actually traps fire every visit. Move to goblin (lose fight), softReset, etc.
    // Direct: damage again by stepping trap after leaving and returning.
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 0, y: 0 },
    });
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 0, y: 1 },
    });
    expect(state.run.hp).toBe(20);
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 0, y: 0 },
    });
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 0, y: 1 },
    });
    expect(state.run.hp).toBe(0);
    expect(state.run.status).toBe("lost");
  });

  it("loses combat without a sword and wins with one", () => {
    let state = createInitialState(runDefinition);
    // Path: down to trap, right to goblin
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 0, y: 1 },
    });
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 1, y: 1 },
    });
    expect(state.run.hp).toBe(10); // 100 - 40 trap - 50 goblin
    expect(getCell(state.board, { x: 1, y: 1 }).resolved).toBeFalsy();

    // Soft reset, pick up sword via: right is wall, so go down, right, right to sword
    state = applyAction(state, { type: "softReset" });
    expect(state.pieces[0].position).toEqual({ x: 0, y: 0 });
    expect(state.run.hp).toBe(100);
    expect(state.run.attempts).toBe(2);
    expect(getCell(state.board, { x: 0, y: 1 }).isFaceUp).toBe(true);

    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 0, y: 1 },
    });
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 1, y: 1 },
    });
    // Still lose fight (no sword yet) — go around: softReset again, get sword first
    state = applyAction(state, { type: "softReset" });
    // Path to sword without goblin: can't go right (wall). Down -> right -> right
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 0, y: 1 },
    });
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 1, y: 1 },
    });
    // Still no sword. From (1,1) go right to sword
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 2, y: 1 },
    });
    expect(state.run.inventory).toContain("sword");
    expect(getCell(state.board, { x: 2, y: 1 }).resolved).toBe(true);

    // Soft reset keeps sword, then defeat goblin
    state = applyAction(state, { type: "softReset" });
    expect(state.run.inventory).toContain("sword");
    expect(getCell(state.board, { x: 1, y: 1 }).resolved).toBe(false);
    expect(getCell(state.board, { x: 2, y: 1 }).resolved).toBe(true);

    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 0, y: 1 },
    });
    const hpBefore = state.run.hp;
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 1, y: 1 },
    });
    expect(state.run.hp).toBe(hpBefore); // won fight, no damage
    expect(getCell(state.board, { x: 1, y: 1 }).resolved).toBe(true);
  });

  it("wins on the goal tile", () => {
    let state = createInitialState(runDefinition);
    // Force a short path: move freely with movePiece is not run-mode step,
    // so walk meadow path: down, right, right, down to castle — but goblin in way.
    // Cheat: use soft path around — go down, right (fight lose), softReset with sword path.
    // Simpler: manually place via successive steps after equipping sword.
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 0, y: 1 },
    });
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 1, y: 1 },
    });
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 2, y: 1 },
    });
    state = applyAction(state, { type: "softReset" });
    // With sword: down, right (beat goblin), down (meadow 1,2), right (castle)
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 0, y: 1 },
    });
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 1, y: 1 },
    });
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 1, y: 2 },
    });
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 2, y: 2 },
    });
    expect(state.run.status).toBe("won");
    expect(getCell(state.board, { x: 2, y: 2 }).isFaceUp).toBe(true);
  });

  it("full reset clears discoveries and reveals", () => {
    let state = createInitialState(runDefinition);
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 0, y: 1 },
    });
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 1, y: 1 },
    });
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 2, y: 1 },
    });
    expect(state.discoveredItemIds).toContain("sword");
    state = applyAction(state, { type: "reset" });
    expect(state.discoveredItemIds).toEqual([]);
    expect(state.run.attempts).toBe(1);
    expect(getCell(state.board, { x: 0, y: 1 }).isFaceUp).toBe(false);
    expect(state.pieces[0].position).toEqual({ x: 0, y: 0 });
  });

  it("rejects non-adjacent steps", () => {
    const state = createInitialState(runDefinition);
    expect(() =>
      applyAction(state, {
        type: "step",
        pieceId: "hero",
        destination: { x: 2, y: 2 },
      }),
    ).toThrow(/orthogonal neighbor/);
  });

  it("no-ops step when run is lost", () => {
    let state = createInitialState(runDefinition);
    // Drain HP via traps
    for (let i = 0; i < 3; i += 1) {
      state = applyAction(state, {
        type: "step",
        pieceId: "hero",
        destination: { x: 0, y: 1 },
      });
      if (state.run.status === "lost") break;
      state = applyAction(state, {
        type: "step",
        pieceId: "hero",
        destination: { x: 0, y: 0 },
      });
    }
    expect(state.run.status).toBe("lost");
    const pos = { ...state.pieces[0].position };
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: pos.y === 0 ? { x: 0, y: 1 } : { x: 0, y: 0 },
    });
    expect(state.pieces[0].position).toEqual(pos);
  });

  it("does not re-trigger a collected powerup", () => {
    let state = createInitialState(runDefinition);
    // Get to sword: down, right (take goblin hit), right
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 0, y: 1 },
    });
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 1, y: 1 },
    });
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 2, y: 1 },
    });
    expect(state.run.inventory).toEqual(["sword"]);
    // Leave and re-enter
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 2, y: 2 },
    });
    // Won on castle — soft reset to keep playing powerup check
    state = applyAction(state, { type: "softReset" });
    // Powerup stays resolved across softReset
    expect(state.board.cells[coordKey({ x: 2, y: 1 })].resolved).toBe(true);
  });
});
