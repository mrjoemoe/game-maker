import { describe, expect, it } from "vitest";
import { createBoard, getCell } from "./index.js";

const baseTypes = [
  { id: "grass", label: "Grass", color: "#4caf50" },
  { id: "water", label: "Water", color: "#2196f3" },
];

describe("board", () => {
  it("fills every cell with the default tile type", () => {
    const board = createBoard({
      grid: { width: 2, height: 2 },
      tileTypes: baseTypes,
      defaultTileTypeId: "grass",
    });
    expect(getCell(board, { x: 0, y: 0 }).typeId).toBe("grass");
    expect(getCell(board, { x: 1, y: 1 }).typeId).toBe("grass");
  });

  it("applies per-cell overrides", () => {
    const board = createBoard({
      grid: { width: 2, height: 2 },
      tileTypes: baseTypes,
      defaultTileTypeId: "grass",
      overrides: [
        { coord: { x: 1, y: 0 }, typeId: "water", isFaceUp: false },
      ],
    });
    expect(getCell(board, { x: 1, y: 0 })).toEqual({
      typeId: "water",
      isFaceUp: false,
      resolved: false,
      walls: [],
    });
    expect(getCell(board, { x: 0, y: 0 }).typeId).toBe("grass");
  });

  it("generates side walls with mostly empty tiles", () => {
    const board = createBoard({
      grid: { width: 7, height: 7 },
      tileTypes: baseTypes,
      defaultTileTypeId: "grass",
      sideWalls: {
        seed: 7,
        weights: { none: 0.7, one: 0.25, two: 0.05 },
      },
    });
    const counts = { 0: 0, 1: 0, 2: 0, other: 0 };
    for (const cell of Object.values(board.cells)) {
      const n = cell.walls?.length ?? 0;
      if (n === 0 || n === 1 || n === 2) counts[n] += 1;
      else counts.other += 1;
    }
    expect(counts.other).toBe(0);
    expect(counts[0]).toBeGreaterThan(counts[1]);
    expect(counts[1]).toBeGreaterThanOrEqual(counts[2]);
  });
});