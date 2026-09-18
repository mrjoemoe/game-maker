import { createInitialState, type GameDefinition } from "@game-maker/engine";
import { describe, expect, it } from "vitest";
import { describeInspectedCell } from "./inspectCell.ts";

const definition: GameDefinition = {
  id: "inspect-test",
  name: "Inspect Test",
  templateId: "tile-board",
  features: { runMode: true },
  run: {
    heroPieceId: "hero",
    startPosition: { x: 0, y: 0 },
    maxHp: 10,
    baseAttack: 1,
  },
  board: {
    grid: { width: 1, height: 1 },
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

describe("describeInspectedCell", () => {
  it("explains a missing selection", () => {
    const game = createInitialState(definition);
    expect(describeInspectedCell(game, null)).toMatch(/inspect/i);
  });

  it("names the tile type and coordinate", () => {
    const game = createInitialState(definition);
    const text = describeInspectedCell(game, { x: 0, y: 0 });
    expect(text).toContain("(0,0)");
    expect(text).toContain("meadow");
    expect(text).toContain("Meadow");
  });
});
