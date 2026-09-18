import { describe, expect, it } from "vitest";
import { createGrid } from "./index.js";
import { projectWalk, shortestWalkDirections } from "./path.js";

describe("shortestWalkDirections", () => {
  const grid = createGrid({ width: 3, height: 3 });

  it("returns an empty walk for the same cell", () => {
    expect(
      shortestWalkDirections(grid, { x: 1, y: 1 }, { x: 1, y: 1 }),
    ).toEqual([]);
  });

  it("walks around a walled shared edge", () => {
    const walk = shortestWalkDirections(
      grid,
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      {
        isCrossingBlocked: (from, to) =>
          from.x === 0 &&
          from.y === 0 &&
          to.x === 1 &&
          to.y === 0,
      },
    );
    expect(walk).toEqual(["down", "right", "up"]);
  });

  it("returns no path when the destination is blocked", () => {
    expect(
      shortestWalkDirections(
        grid,
        { x: 0, y: 0 },
        { x: 2, y: 2 },
        { isCellBlocked: (coord) => coord.x === 2 && coord.y === 2 },
      ),
    ).toBeNull();
  });

  it("projects a walk from an origin", () => {
    expect(projectWalk({ x: 3, y: 6 }, ["up", "left"])).toEqual({
      x: 2,
      y: 5,
    });
  });
});
