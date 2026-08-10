import { describe, expect, it } from "vitest";
import { createGrid, isInBounds, neighbors, allCoords } from "./index.js";

describe("grid", () => {
  it("creates a W×H grid from config", () => {
    const grid = createGrid({ width: 3, height: 2 });
    expect(grid).toEqual({ width: 3, height: 2 });
    expect(allCoords(grid)).toHaveLength(6);
  });

  it("reports out-of-bounds coordinates", () => {
    const grid = createGrid({ width: 2, height: 2 });
    expect(isInBounds(grid, { x: 0, y: 0 })).toBe(true);
    expect(isInBounds(grid, { x: 2, y: 0 })).toBe(false);
    expect(isInBounds(grid, { x: 0, y: -1 })).toBe(false);
  });

  it("returns orthogonal in-bounds neighbors", () => {
    const grid = createGrid({ width: 3, height: 3 });
    expect(neighbors(grid, { x: 0, y: 0 })).toEqual([
      { x: 1, y: 0 },
      { x: 0, y: 1 },
    ]);
    expect(neighbors(grid, { x: 1, y: 1 })).toHaveLength(4);
  });
});
