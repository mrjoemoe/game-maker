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
    });
    expect(getCell(board, { x: 0, y: 0 }).typeId).toBe("grass");
  });
});
