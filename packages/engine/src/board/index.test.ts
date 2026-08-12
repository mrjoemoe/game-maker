import { describe, expect, it } from "vitest";
import { createBoard, getCell } from "./index.js";
import { isGridConnected } from "../tiles/index.js";

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
    expect(board.edgeWalls).toEqual([]);
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
      coins: 0,
    });
    expect(getCell(board, { x: 0, y: 0 }).typeId).toBe("grass");
  });

  it("places exactly count connected edge walls", () => {
    const board = createBoard({
      grid: { width: 7, height: 7 },
      tileTypes: baseTypes,
      defaultTileTypeId: "grass",
      edgeWalls: { count: 15, seed: 7 },
    });
    expect(board.edgeWalls).toHaveLength(15);
    expect(isGridConnected(board.grid, board.edgeWalls)).toBe(true);
  });

  it("places multiple cells when randomPlacement count is set", () => {
    const board = createBoard({
      grid: { width: 4, height: 4 },
      tileTypes: [
        ...baseTypes,
        { id: "pit", label: "Pit", color: "#333" },
      ],
      defaultTileTypeId: "grass",
      edgeWalls: { count: 0, seed: 99 },
      randomPlacements: [{ typeId: "pit", count: 3 }],
    });
    const pits = Object.values(board.cells).filter((c) => c.typeId === "pit");
    expect(pits).toHaveLength(3);
  });

  it("changes random placements when the edge-wall seed changes", () => {
    const types = [
      ...baseTypes,
      { id: "pit", label: "Pit", color: "#333" },
    ];
    const fingerprint = (seed: number) => {
      const board = createBoard({
        grid: { width: 5, height: 5 },
        tileTypes: types,
        defaultTileTypeId: "grass",
        edgeWalls: { count: 0, seed },
        randomPlacements: [{ typeId: "pit", count: 4 }],
      });
      return Object.entries(board.cells)
        .filter(([, c]) => c.typeId === "pit")
        .map(([k]) => k)
        .sort()
        .join("|");
    };
    expect(fingerprint(1)).not.toBe(fingerprint(2));
  });

  it("assigns coin stacks from coinWeights", () => {
    const board = createBoard({
      grid: { width: 5, height: 5 },
      tileTypes: baseTypes,
      defaultTileTypeId: "grass",
      edgeWalls: { count: 0, seed: 11 },
      coinWeights: { zero: 0.4, one: 0.3, two: 0.2, three: 0.1 },
    });
    const counts = Object.values(board.cells).map((c) => c.coins ?? 0);
    expect(counts.every((n) => n >= 0 && n <= 3)).toBe(true);
    expect(counts.some((n) => n > 0)).toBe(true);
  });
});
