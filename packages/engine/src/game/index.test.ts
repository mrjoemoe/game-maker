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
      { coord: { x: 0, y: 2 }, typeId: "trap" },
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

  it("allows stepping onto meadow and keeps playing", () => {
    let state = createInitialState(runDefinition);
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 0, y: 1 },
    });
    expect(state.pieces[0].position).toEqual({ x: 0, y: 1 });
    expect(state.run.status).toBe("playing");
    expect(state.run.bump).toBeNull();
  });

  it("ends the path as a loss on a full-cell wall and reports it", () => {
    let state = createInitialState(runDefinition);
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 1, y: 0 },
    });
    expect(state.pieces[0].position).toEqual({ x: 0, y: 0 });
    expect(getCell(state.board, { x: 1, y: 0 }).isFaceUp).toBe(true);
    expect(state.run.status).toBe("lost");
    expect(state.run.bump).toMatch(/Wall.*path over/i);
  });

  it("ends the path as a loss on a trap and reports it", () => {
    let state = createInitialState(runDefinition);
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 0, y: 1 },
    });
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 0, y: 2 },
    });
    expect(state.pieces[0].position).toEqual({ x: 0, y: 2 });
    expect(state.run.status).toBe("lost");
    expect(state.run.bump).toBe("You found a Trap — path over");
  });

  it("ends the path when stepping onto the castle from an adjacent meadow", () => {
    const nearCastle: GameDefinition = {
      ...runDefinition,
      run: {
        ...runDefinition.run!,
        startPosition: { x: 1, y: 2 },
      },
      initialPieces: [
        { id: "hero", typeId: "hero", position: { x: 1, y: 2 } },
      ],
    };
    let state = createInitialState(nearCastle);
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 2, y: 2 },
    });
    expect(state.pieces[0].position).toEqual({ x: 2, y: 2 });
    expect(state.run.status).toBe("lost");
    expect(state.run.bump).toBe("You found a Castle — path over");
  });

  it("stops a program early once the path is over", () => {
    const programmed: GameDefinition = {
      ...runDefinition,
      run: { ...runDefinition.run!, programLength: 3 },
    };
    let state = createInitialState(programmed);
    // down (meadow), down (trap → lose), up would be ignored
    state = applyAction(state, {
      type: "runProgram",
      pieceId: "hero",
      steps: [
        { action: { kind: "none" }, move: "down" },
        { action: { kind: "none" }, move: "down" },
        { action: { kind: "none" }, move: "up" },
      ],
    });
    expect(state.run.status).toBe("lost");
    expect(state.pieces[0].position).toEqual({ x: 0, y: 2 });
    expect(state.run.bump).toMatch(/Trap.*path over/);
  });

  it("soft reset returns to start after a path-over loss", () => {
    let state = createInitialState(runDefinition);
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 1, y: 0 },
    });
    expect(state.run.status).toBe("lost");
    state = applyAction(state, { type: "softReset" });
    expect(state.run.status).toBe("playing");
    expect(state.pieces[0].position).toEqual({ x: 0, y: 0 });
    expect(state.run.attempts).toBe(2);
    expect(getCell(state.board, { x: 1, y: 0 }).isFaceUp).toBe(true);
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

  it("rejects programs of the wrong length", () => {
    const programmed: GameDefinition = {
      ...runDefinition,
      run: { ...runDefinition.run!, programLength: 6 },
    };
    const state = createInitialState(programmed);
    expect(() =>
      applyAction(state, {
        type: "runProgram",
        pieceId: "hero",
        steps: [
          { action: { kind: "none" }, move: "up" },
          { action: { kind: "none" }, move: "up" },
        ],
      }),
    ).toThrow(/exactly 6 steps/);
  });

  it("blocks an origin side wall without revealing the destination", () => {
    const walled: GameDefinition = {
      ...runDefinition,
      board: {
        ...runDefinition.board,
        overrides: [
          ...(runDefinition.board.overrides ?? []),
          { coord: { x: 0, y: 0 }, walls: ["s"] },
        ],
      },
    };
    let state = createInitialState(walled);
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 0, y: 1 },
    });
    expect(state.pieces[0].position).toEqual({ x: 0, y: 0 });
    expect(getCell(state.board, { x: 0, y: 1 }).isFaceUp).toBe(false);
    expect(state.run.status).toBe("lost");
    expect(state.run.bump).toMatch(/wall on this tile.*path over/i);
  });

  it("blocks a destination side wall and reveals that tile", () => {
    const walled: GameDefinition = {
      ...runDefinition,
      board: {
        ...runDefinition.board,
        overrides: [
          ...(runDefinition.board.overrides ?? []),
          { coord: { x: 0, y: 1 }, walls: ["n"] },
        ],
      },
    };
    let state = createInitialState(walled);
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 0, y: 1 },
    });
    expect(state.pieces[0].position).toEqual({ x: 0, y: 0 });
    expect(getCell(state.board, { x: 0, y: 1 }).isFaceUp).toBe(true);
    expect(state.run.status).toBe("lost");
    expect(state.run.bump).toMatch(/wall on the next tile.*path over/i);
  });

  it("no-ops step when run is already lost", () => {
    let state = createInitialState(runDefinition);
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 1, y: 0 },
    });
    expect(state.run.status).toBe("lost");
    const pos = { ...state.pieces[0].position };
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 0, y: 1 },
    });
    expect(state.pieces[0].position).toEqual(pos);
  });

  it("crosses a wall only when the pass item is used that step", () => {
    const withPass: GameDefinition = {
      ...runDefinition,
      items: [...(runDefinition.items ?? []), { id: "axe", label: "Axe" }],
      board: {
        ...runDefinition.board,
        tileTypes: runDefinition.board.tileTypes.map((t) =>
          t.id === "wall" ? { ...t, passItemId: "axe" } : t,
        ),
      },
    };
    let state = createInitialState(withPass);
    state = {
      ...state,
      run: { ...state.run, inventory: ["axe"] },
    };
    // Holding alone is not enough.
    const blocked = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 1, y: 0 },
    });
    expect(blocked.run.status).toBe("lost");

    state = applyAction(state, {
      type: "programStep",
      pieceId: "hero",
      step: { action: { kind: "useItem", itemId: "axe" }, move: "right" },
    });
    expect(state.pieces[0].position).toEqual({ x: 1, y: 0 });
    expect(state.run.status).toBe("playing");
  });

  it("still paths over a hazard without using its pass item", () => {
    const withPass: GameDefinition = {
      ...runDefinition,
      items: [...(runDefinition.items ?? []), { id: "boots", label: "Boots" }],
      board: {
        ...runDefinition.board,
        tileTypes: runDefinition.board.tileTypes.map((t) =>
          t.id === "trap" ? { ...t, passItemId: "boots" } : t,
        ),
      },
    };
    let state = createInitialState(withPass);
    state = {
      ...state,
      run: { ...state.run, inventory: ["boots"] },
    };
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 0, y: 1 },
    });
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 0, y: 2 },
    });
    expect(state.pieces[0].position).toEqual({ x: 0, y: 2 });
    expect(state.run.status).toBe("lost");
    expect(state.run.bump).toMatch(/Trap.*path over/);
  });

  it("wins on goal when using its pass item that step", () => {
    const withPass: GameDefinition = {
      ...runDefinition,
      items: [...(runDefinition.items ?? []), { id: "sneak", label: "Sneak" }],
      board: {
        ...runDefinition.board,
        tileTypes: runDefinition.board.tileTypes.map((t) =>
          t.id === "castle" ? { ...t, passItemId: "sneak" } : t,
        ),
        overrides: [{ coord: { x: 0, y: 1 }, typeId: "castle" }],
      },
    };
    let state = createInitialState(withPass);
    state = {
      ...state,
      run: { ...state.run, inventory: ["sneak"] },
    };
    state = applyAction(state, {
      type: "programStep",
      pieceId: "hero",
      step: { action: { kind: "useItem", itemId: "sneak" }, move: "down" },
    });
    expect(state.pieces[0].position).toEqual({ x: 0, y: 1 });
    expect(state.run.status).toBe("won");
  });

  it("takes from Mage via program action and persists across soft reset", () => {
    const withMage: GameDefinition = {
      ...runDefinition,
      board: {
        ...runDefinition.board,
        tileTypes: [
          ...runDefinition.board.tileTypes,
          { id: "mage", label: "Mage", color: "#6a5acd", effect: { kind: "mage" } },
        ],
        overrides: [{ coord: { x: 0, y: 0 }, typeId: "mage" }],
      },
    };
    let state = createInitialState(withMage);
    expect(state.run.inventory).toEqual([]);

    state = applyAction(state, {
      type: "programStep",
      pieceId: "hero",
      step: {
        action: { kind: "takeFromMage", itemId: "sword" },
        move: "down",
      },
    });
    expect(state.run.inventory).toEqual(["sword"]);
    expect(state.discoveredItemIds).toEqual(["sword"]);
    expect(getCell(state.board, { x: 0, y: 0 }).resolved).toBe(true);
    expect(state.pieces[0].position).toEqual({ x: 0, y: 1 });
    expect(state.run.status).toBe("playing");

    state = applyAction(state, { type: "softReset" });
    expect(state.run.inventory).toEqual(["sword"]);
    expect(getCell(state.board, { x: 0, y: 0 }).resolved).toBe(true);

    // Taking again on a resolved Mage fails.
    state = applyAction(state, {
      type: "programStep",
      pieceId: "hero",
      step: {
        action: { kind: "takeFromMage", itemId: "shield" },
        move: "down",
      },
    });
    expect(state.run.status).toBe("lost");
    expect(state.run.bump).toMatch(/No Mage/i);
  });

  it("breaks a side wall with a sledgehammer use action", () => {
    const withHammer: GameDefinition = {
      ...runDefinition,
      items: [
        ...(runDefinition.items ?? []),
        { id: "sledgehammer", label: "Sledgehammer", breaksSideWalls: true },
      ],
      board: {
        ...runDefinition.board,
        overrides: [
          ...(runDefinition.board.overrides ?? []),
          { coord: { x: 0, y: 0 }, walls: ["s"] },
        ],
      },
    };
    let state = createInitialState(withHammer);
    state = {
      ...state,
      run: { ...state.run, inventory: ["sledgehammer"] },
    };
    state = applyAction(state, {
      type: "programStep",
      pieceId: "hero",
      step: {
        action: { kind: "useItem", itemId: "sledgehammer" },
        move: "down",
      },
    });
    expect(state.run.status).toBe("playing");
    expect(state.pieces[0].position).toEqual({ x: 0, y: 1 });
    expect(getCell(state.board, { x: 0, y: 0 }).walls ?? []).not.toContain("s");
  });

  it("does not peek past an origin wall when using a pass item", () => {
    const withPass: GameDefinition = {
      ...runDefinition,
      items: [...(runDefinition.items ?? []), { id: "boots", label: "Boots" }],
      board: {
        ...runDefinition.board,
        tileTypes: runDefinition.board.tileTypes.map((t) =>
          t.id === "trap" ? { ...t, passItemId: "boots" } : t,
        ),
        overrides: [
          ...(runDefinition.board.overrides ?? []),
          { coord: { x: 0, y: 0 }, walls: ["s"] },
        ],
      },
    };
    let state = createInitialState(withPass);
    state = {
      ...state,
      run: { ...state.run, inventory: ["boots"] },
    };
    state = applyAction(state, {
      type: "programStep",
      pieceId: "hero",
      step: { action: { kind: "useItem", itemId: "boots" }, move: "down" },
    });
    expect(state.run.status).toBe("lost");
    expect(state.pieces[0].position).toEqual({ x: 0, y: 0 });
    expect(getCell(state.board, { x: 0, y: 1 }).isFaceUp).toBe(false);
    expect(state.run.bump).toMatch(/wall on this tile/i);
  });

  it("fails takeFromMage when not on a Mage", () => {
    let state = createInitialState(runDefinition);
    state = applyAction(state, {
      type: "programStep",
      pieceId: "hero",
      step: {
        action: { kind: "takeFromMage", itemId: "sword" },
        move: "down",
      },
    });
    expect(state.run.status).toBe("lost");
    expect(state.pieces[0].position).toEqual({ x: 0, y: 0 });
  });

  it("full reset in run mode rerolls the side-wall seed", () => {
    const seeded: GameDefinition = {
      ...runDefinition,
      board: {
        ...runDefinition.board,
        sideWalls: { seed: 42, weights: { none: 0.7, one: 0.25, two: 0.05 } },
      },
    };
    let state = createInitialState(seeded);
    expect(state.definition.board.sideWalls?.seed).toBe(42);

    const seeds = new Set<number>();
    for (let i = 0; i < 8; i += 1) {
      state = applyAction(state, { type: "reset" });
      const seed = state.definition.board.sideWalls?.seed;
      expect(typeof seed).toBe("number");
      seeds.add(seed!);
    }
    expect(seeds.size).toBeGreaterThan(1);
    expect(seeds.has(42)).toBe(false);
  });
});
