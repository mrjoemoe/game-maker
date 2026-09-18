import { createInitialState, type GameDefinition } from "@game-maker/engine";
import { describe, expect, it } from "vitest";
import { canQueueWalk, walkMovesToQueue } from "./queueWalk.ts";

const runDefinition: GameDefinition = {
  id: "queue-test",
  name: "Queue Test",
  templateId: "tile-board",
  features: { runMode: true, tileFlip: false },
  run: {
    heroPieceId: "hero",
    startPosition: { x: 0, y: 0 },
    maxHp: 100,
    baseAttack: 1,
    programLength: 10,
  },
  board: {
    grid: { width: 2, height: 2 },
    tileTypes: [
      {
        id: "meadow",
        label: "Meadow",
        color: "#6aa84f",
        effect: { kind: "empty" },
      },
    ],
    defaultTileTypeId: "meadow",
  },
  pieceTypes: [{ id: "hero", label: "Hero", color: "#c47a2c" }],
  initialPieces: [{ id: "hero", typeId: "hero", position: { x: 0, y: 0 } }],
};

describe("walkMovesToQueue", () => {
  it("queues a detour around a walled shared edge", () => {
    const game = createInitialState(runDefinition);
    game.board.edgeWalls = ["h:0,0"];
    const steps = walkMovesToQueue(game, [], { x: 1, y: 0 }, 10);
    expect(steps).toEqual([
      { kind: "move", direction: "down" },
      { kind: "move", direction: "right" },
      { kind: "move", direction: "up" },
    ]);
  });

  it("continues from the projected end of queued moves", () => {
    const game = createInitialState(runDefinition);
    const steps = walkMovesToQueue(
      game,
      [{ kind: "move", direction: "down" }],
      { x: 1, y: 1 },
      10,
    );
    expect(steps).toEqual([{ kind: "move", direction: "right" }]);
  });

  it("truncates to remaining slots", () => {
    const game = createInitialState(runDefinition);
    const steps = walkMovesToQueue(game, [], { x: 1, y: 1 }, 1);
    expect(steps).toHaveLength(1);
  });

  it("locks the chart after extract or while executing", () => {
    expect(canQueueWalk([], 4, false, true)).toBe(true);
    expect(canQueueWalk([{ kind: "extract" }], 4, false, true)).toBe(false);
    expect(canQueueWalk([], 4, true, true)).toBe(false);
    expect(canQueueWalk([], 0, false, true)).toBe(false);
  });
});
