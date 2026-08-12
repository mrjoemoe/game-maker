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
        { kind: "move", direction: "down" },
        { kind: "move", direction: "down" },
        { kind: "move", direction: "up" },
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

  it("rejects empty or over-long programs", () => {
    const programmed: GameDefinition = {
      ...runDefinition,
      run: { ...runDefinition.run!, programLength: 6 },
    };
    const state = createInitialState(programmed);
    expect(() =>
      applyAction(state, {
        type: "runProgram",
        pieceId: "hero",
        steps: [],
      }),
    ).toThrow(/between 1 and 6 actions/);
    expect(() =>
      applyAction(state, {
        type: "runProgram",
        pieceId: "hero",
        steps: Array.from({ length: 7 }, () => ({
          kind: "move" as const,
          direction: "up" as const,
        })),
      }),
    ).toThrow(/between 1 and 6 actions/);
  });

  it("accepts a short program under programLength", () => {
    const programmed: GameDefinition = {
      ...runDefinition,
      run: { ...runDefinition.run!, programLength: 6 },
    };
    let state = createInitialState(programmed);
    state = applyAction(state, {
      type: "runProgram",
      pieceId: "hero",
      steps: [{ kind: "move", direction: "down" }],
    });
    expect(state.run.status).toBe("playing");
    expect(state.pieces[0].position).toEqual({ x: 0, y: 1 });
  });

  it("blocks a shared edge wall and reveals the destination", () => {
    let state = createInitialState(runDefinition);
    state = {
      ...state,
      board: { ...state.board, edgeWalls: ["v:0,0"] },
    };
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 0, y: 1 },
    });
    expect(state.pieces[0].position).toEqual({ x: 0, y: 0 });
    expect(getCell(state.board, { x: 0, y: 1 }).isFaceUp).toBe(true);
    expect(state.run.status).toBe("lost");
    expect(state.run.bump).toMatch(/wall between the tiles.*path over/i);
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
      step: { kind: "useItem", itemId: "axe" },

      });

      state = applyAction(state, {

        type: "programStep",

        pieceId: "hero",

        step: { kind: "move", direction: "right" },
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
      run: { ...state.run, inventory: ["sneak", "sword"] },
    };
    state = applyAction(state, {
      type: "programStep",
      pieceId: "hero",
      step: { kind: "useItem", itemId: "sneak" },

      });

      state = applyAction(state, {

        type: "programStep",

        pieceId: "hero",

        step: { kind: "move", direction: "down" },
    });
    expect(state.pieces[0].position).toEqual({ x: 0, y: 1 });
    expect(state.run.status).toBe("won");
    expect(state.run.inventory).toEqual([]);
    expect(state.stashItemIds).toEqual(["sword"]);
  });

  it("takes from Mage into run inventory only; soft reset refreshes Mage", () => {
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
    expect(state.stashItemIds).toEqual([]);

    state = applyAction(state, {
      type: "programStep",
      pieceId: "hero",
      step: { kind: "takeFromMage", itemId: "sword" },
    });
    expect(state.run.inventory).toEqual(["sword"]);
    expect(state.stashItemIds).toEqual([]);
    expect(getCell(state.board, { x: 0, y: 0 }).resolved).toBe(true);
    expect(state.pieces[0].position).toEqual({ x: 0, y: 0 });
    expect(state.run.status).toBe("playing");

    state = applyAction(state, { type: "softReset" });
    expect(state.run.inventory).toEqual([]);
    expect(state.stashItemIds).toEqual([]);
    expect(getCell(state.board, { x: 0, y: 0 }).resolved).toBe(false);

    // Taking again after soft reset works.
    state = applyAction(state, {
      type: "programStep",
      pieceId: "hero",
      step: { kind: "takeFromMage", itemId: "shield" },
    });
    expect(state.run.status).toBe("playing");
    expect(state.run.inventory).toEqual(["shield"]);
    expect(getCell(state.board, { x: 0, y: 0 }).resolved).toBe(true);
  });

  it("extracts via program action while on extraction", () => {
    const withExtract: GameDefinition = {
      ...runDefinition,
      board: {
        ...runDefinition.board,
        tileTypes: [
          ...runDefinition.board.tileTypes,
          {
            id: "extraction",
            label: "Extraction",
            color: "#567",
            effect: { kind: "extraction" },
          },
        ],
        overrides: [{ coord: { x: 0, y: 1 }, typeId: "extraction" }],
      },
    };
    let state = createInitialState(withExtract);
    expect(getCell(state.board, { x: 0, y: 1 }).isFaceUp).toBe(true);
    state = {
      ...state,
      run: { ...state.run, inventory: ["sword"] },
    };
    // Step onto extraction — safe, still playing.
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 0, y: 1 },
    });
    expect(state.run.status).toBe("playing");
    expect(state.stashItemIds).toEqual([]);
    expect(state.pieces[0].position).toEqual({ x: 0, y: 1 });

    // Extract action banks and ends; move is unused.
    state = applyAction(state, {
      type: "programStep",
      pieceId: "hero",
      step: { kind: "extract" },
    });
    expect(state.run.status).toBe("extracted");
    expect(state.run.inventory).toEqual([]);
    expect(state.stashItemIds).toEqual(["sword"]);
    expect(state.pieces[0].position).toEqual({ x: 0, y: 1 });
  });

  it("breaks a shared edge into the castle with the sledgehammer and wins", () => {
    const walledCastle: GameDefinition = {
      ...runDefinition,
      items: [
        ...(runDefinition.items ?? []),
        { id: "sledgehammer", label: "Sledgehammer", breaksSideWalls: true },
      ],
      board: {
        ...runDefinition.board,
        tileTypes: runDefinition.board.tileTypes.map((t) =>
          t.id === "castle" ? { ...t, passItemId: "sledgehammer" } : t,
        ),
        overrides: [
          { coord: { x: 0, y: 0 }, typeId: "meadow" },
          { coord: { x: 0, y: 1 }, typeId: "castle" },
        ],
      },
    };
    let state = createInitialState(walledCastle);
    state = {
      ...state,
      board: { ...state.board, edgeWalls: ["v:0,0", "h:0,1", "v:0,1"] },
      run: { ...state.run, inventory: ["sledgehammer", "sword"] },
    };
    state = applyAction(state, {
      type: "programStep",
      pieceId: "hero",
      step: { kind: "useItem", itemId: "sledgehammer" },

      });

      state = applyAction(state, {

        type: "programStep",

        pieceId: "hero",

        step: { kind: "move", direction: "down" },
    });
    expect(state.run.status).toBe("won");
    expect(state.pieces[0].position).toEqual({ x: 0, y: 1 });
    expect(state.run.inventory).toEqual([]);
    expect(state.stashItemIds).toEqual(["sword"]);
    // Only the crossed edge is cleared; other edges remain.
    expect(state.board.edgeWalls).toEqual(["h:0,1", "v:0,1"]);
  });

  it("fails extract when not on an extraction tile", () => {
    let state = createInitialState(runDefinition);
    state = applyAction(state, {
      type: "programStep",
      pieceId: "hero",
      step: { kind: "extract" },
    });
    expect(state.run.status).toBe("lost");
    expect(state.pieces[0].position).toEqual({ x: 0, y: 0 });
    expect(state.run.bump).toMatch(/extraction/i);
  });

  it("commits loadout from stash and loses it on fail", () => {
    let state = createInitialState(runDefinition);
    state = { ...state, stashItemIds: ["sword", "shield"] };
    state = applyAction(state, {
      type: "commitLoadout",
      itemIds: ["sword"],
    });
    expect(state.run.inventory).toEqual(["sword"]);
    expect(state.stashItemIds).toEqual(["shield"]);

    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 1, y: 0 },
    });
    expect(state.run.status).toBe("lost");

    state = applyAction(state, { type: "softReset" });
    expect(state.run.inventory).toEqual([]);
    expect(state.stashItemIds).toEqual(["shield"]);
  });

  it("consumes a pass item on successful traverse", () => {
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
      run: { ...state.run, inventory: ["axe", "sword"] },
    };
    state = applyAction(state, {
      type: "programStep",
      pieceId: "hero",
      step: { kind: "useItem", itemId: "axe" },

      });

      state = applyAction(state, {

        type: "programStep",

        pieceId: "hero",

        step: { kind: "move", direction: "right" },
    });
    expect(state.run.status).toBe("playing");
    expect(state.pieces[0].position).toEqual({ x: 1, y: 0 });
    expect(state.run.inventory).toEqual(["sword"]);
  });

  it("breaks a shared edge wall with a sledgehammer use action", () => {
    const withHammer: GameDefinition = {
      ...runDefinition,
      items: [
        ...(runDefinition.items ?? []),
        { id: "sledgehammer", label: "Sledgehammer", breaksSideWalls: true },
      ],
    };
    let state = createInitialState(withHammer);
    state = {
      ...state,
      board: { ...state.board, edgeWalls: ["v:0,0"] },
      run: { ...state.run, inventory: ["sledgehammer"] },
    };
    state = applyAction(state, {
      type: "programStep",
      pieceId: "hero",
      step: { kind: "useItem", itemId: "sledgehammer" },

      });

      state = applyAction(state, {

        type: "programStep",

        pieceId: "hero",

        step: { kind: "move", direction: "down" },
    });
    expect(state.run.status).toBe("playing");
    expect(state.pieces[0].position).toEqual({ x: 0, y: 1 });
    expect(state.board.edgeWalls).toEqual([]);
    expect(state.run.inventory).toEqual([]);
  });

  it("enters a hazard past a shared edge wall when using its pass item", () => {
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
      pieces: [{ id: "hero", typeId: "hero", position: { x: 0, y: 1 } }],
      board: { ...state.board, edgeWalls: ["v:0,1"] },
      run: { ...state.run, inventory: ["boots"] },
    };
    state = applyAction(state, {
      type: "programStep",
      pieceId: "hero",
      step: { kind: "useItem", itemId: "boots" },

      });

      state = applyAction(state, {

        type: "programStep",

        pieceId: "hero",

        step: { kind: "move", direction: "down" },
    });
    expect(state.run.status).toBe("playing");
    expect(state.pieces[0].position).toEqual({ x: 0, y: 2 });
    expect(state.run.inventory).toEqual([]);
    expect(state.board.edgeWalls).toEqual([]);
  });

  it("paths over when using the wrong item across an edge wall", () => {
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
      board: { ...state.board, edgeWalls: ["v:0,0"] },
      run: { ...state.run, inventory: ["sword"] },
    };
    state = applyAction(state, {
      type: "programStep",
      pieceId: "hero",
      step: { kind: "useItem", itemId: "sword" },

      });

      state = applyAction(state, {

        type: "programStep",

        pieceId: "hero",

        step: { kind: "move", direction: "down" },
    });
    expect(state.run.status).toBe("lost");
    expect(state.pieces[0].position).toEqual({ x: 0, y: 0 });
    expect(getCell(state.board, { x: 0, y: 1 }).isFaceUp).toBe(true);
    expect(state.run.bump).toMatch(/wall between the tiles/i);
  });

  it("fails takeFromMage when not on a Mage", () => {
    let state = createInitialState(runDefinition);
    state = applyAction(state, {
      type: "programStep",
      pieceId: "hero",
      step: { kind: "takeFromMage", itemId: "sword" },
    });
    expect(state.run.status).toBe("lost");
    expect(state.pieces[0].position).toEqual({ x: 0, y: 0 });
  });

  it("full reset in run mode rerolls the edge-wall seed", () => {
    const seeded: GameDefinition = {
      ...runDefinition,
      board: {
        ...runDefinition.board,
        edgeWalls: { count: 3, seed: 42 },
      },
    };
    let state = createInitialState(seeded);
    expect(state.definition.board.edgeWalls?.seed).toBe(42);

    const seeds = new Set<number>();
    for (let i = 0; i < 8; i += 1) {
      state = applyAction(state, { type: "reset" });
      const seed = state.definition.board.edgeWalls?.seed;
      expect(typeof seed).toBe("number");
      seeds.add(seed!);
    }
    expect(seeds.size).toBeGreaterThan(1);
    expect(seeds.has(42)).toBe(false);
  });

  it("collects coins on safe landing and keeps them after soft reset", () => {
    let state = createInitialState(runDefinition);
    const key = "0,1";
    state = {
      ...state,
      board: {
        ...state.board,
        cells: {
          ...state.board.cells,
          [key]: { ...state.board.cells[key]!, coins: 2 },
        },
      },
    };
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 0, y: 1 },
    });
    expect(state.run.status).toBe("playing");
    expect(state.coins).toBe(2);
    expect(getCell(state.board, { x: 0, y: 1 }).coins).toBe(2);
    expect(state.run.bump).toMatch(/Collected 2 coins — wallet 2/);

    state = applyAction(state, { type: "softReset" });
    expect(state.coins).toBe(2);
    expect(getCell(state.board, { x: 0, y: 1 }).coins).toBe(2);
    expect(state.claimedCoinKeys).toEqual([]);

    // Soft reset clears claims so the same stack can be gathered again.
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 0, y: 1 },
    });
    expect(state.coins).toBe(4);
  });

  it("does not collect coins on path-over", () => {
    let state = createInitialState(runDefinition);
    state = {
      ...state,
      board: {
        ...state.board,
        cells: {
          ...state.board.cells,
          "1,0": { ...state.board.cells["1,0"]!, coins: 3 },
        },
      },
    };
    state = applyAction(state, {
      type: "step",
      pieceId: "hero",
      destination: { x: 1, y: 0 },
    });
    expect(state.run.status).toBe("lost");
    expect(state.coins).toBe(0);
    expect(getCell(state.board, { x: 1, y: 0 }).coins).toBe(3);
  });

  it("buys from a shop for coins into run inventory", () => {
    const withShop: GameDefinition = {
      ...runDefinition,
      board: {
        ...runDefinition.board,
        tileTypes: [
          ...runDefinition.board.tileTypes,
          { id: "shop", label: "Shop", color: "#c4a", effect: { kind: "shop" } },
        ],
        overrides: [{ coord: { x: 0, y: 0 }, typeId: "shop" }],
      },
    };
    let state = createInitialState(withShop);
    state = { ...state, coins: 7 };
    state = applyAction(state, {
      type: "programStep",
      pieceId: "hero",
      step: { kind: "buyFromShop", itemId: "sword" },
    });
    expect(state.run.status).toBe("playing");
    expect(state.coins).toBe(4);
    expect(state.run.inventory).toEqual(["sword"]);
    expect(state.pieces[0].position).toEqual({ x: 0, y: 0 });

    // Shop stays open for another buy.
    state = applyAction(state, {
      type: "programStep",
      pieceId: "hero",
      step: { kind: "buyFromShop", itemId: "shield" },
    });
    expect(state.coins).toBe(1);
    expect(state.run.inventory).toEqual(["sword", "shield"]);
  });

  it("fails buyFromShop without enough coins", () => {
    const withShop: GameDefinition = {
      ...runDefinition,
      board: {
        ...runDefinition.board,
        tileTypes: [
          ...runDefinition.board.tileTypes,
          { id: "shop", label: "Shop", color: "#c4a", effect: { kind: "shop" } },
        ],
        overrides: [{ coord: { x: 0, y: 0 }, typeId: "shop" }],
      },
    };
    let state = createInitialState(withShop);
    state = { ...state, coins: 2 };
    state = applyAction(state, {
      type: "programStep",
      pieceId: "hero",
      step: { kind: "buyFromShop", itemId: "sword" },
    });
    expect(state.run.status).toBe("lost");
    expect(state.coins).toBe(2);
    expect(state.run.inventory).toEqual([]);
  });

  it("travels between discovered portals and skips the move", () => {
    const withPortals: GameDefinition = {
      ...runDefinition,
      board: {
        ...runDefinition.board,
        tileTypes: [
          ...runDefinition.board.tileTypes,
          {
            id: "portal-1",
            label: "Portal 1",
            color: "#65a",
            effect: { kind: "portal", portalId: 1 },
          },
          {
            id: "portal-2",
            label: "Portal 2",
            color: "#65a",
            effect: { kind: "portal", portalId: 2 },
          },
        ],
        overrides: [
          { coord: { x: 0, y: 0 }, typeId: "portal-1", isFaceUp: true },
          { coord: { x: 2, y: 0 }, typeId: "portal-2", isFaceUp: true },
        ],
      },
    };
    let state = createInitialState(withPortals);
    state = {
      ...state,
      board: {
        ...state.board,
        cells: {
          ...state.board.cells,
          "2,0": { ...state.board.cells["2,0"]!, isFaceUp: true },
        },
      },
    };
    state = applyAction(state, {
      type: "programStep",
      pieceId: "hero",
      step: { kind: "travelToPortal", portalId: 2 },
    });
    expect(state.run.status).toBe("playing");
    expect(state.pieces[0].position).toEqual({ x: 2, y: 0 });
    expect(state.run.bump).toMatch(/Traveled to Portal 2/);
  });

  it("fails travel to a hidden portal", () => {
    const withPortals: GameDefinition = {
      ...runDefinition,
      board: {
        ...runDefinition.board,
        tileTypes: [
          ...runDefinition.board.tileTypes,
          {
            id: "portal-1",
            label: "Portal 1",
            color: "#65a",
            effect: { kind: "portal", portalId: 1 },
          },
          {
            id: "portal-2",
            label: "Portal 2",
            color: "#65a",
            effect: { kind: "portal", portalId: 2 },
          },
        ],
        overrides: [
          { coord: { x: 0, y: 0 }, typeId: "portal-1", isFaceUp: true },
          { coord: { x: 2, y: 0 }, typeId: "portal-2", isFaceUp: false },
        ],
      },
    };
    let state = createInitialState(withPortals);
    // Force portal-2 face-down after run-mode face-up rules.
    state = {
      ...state,
      board: {
        ...state.board,
        cells: {
          ...state.board.cells,
          "2,0": { ...state.board.cells["2,0"]!, isFaceUp: false },
        },
      },
    };
    state = applyAction(state, {
      type: "programStep",
      pieceId: "hero",
      step: { kind: "travelToPortal", portalId: 2 },
    });
    expect(state.run.status).toBe("lost");
    expect(state.pieces[0].position).toEqual({ x: 0, y: 0 });
  });

  it("fails travel when not on a portal", () => {
    let state = createInitialState(runDefinition);
    state = applyAction(state, {
      type: "programStep",
      pieceId: "hero",
      step: { kind: "travelToPortal", portalId: 1 },
    });
    expect(state.run.status).toBe("lost");
  });
});
