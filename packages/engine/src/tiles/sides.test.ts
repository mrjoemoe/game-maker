import { describe, expect, it } from "vitest";
import {
  edgeKeyBetween,
  generateConnectedEdgeWalls,
  hasEdgeWall,
  isCrossingBlocked,
  isGridConnected,
  listInternalEdges,
  verticalEdgeKey,
} from "./sides.js";

describe("edge walls", () => {
  it("blocks a crossing when the shared edge has a wall", () => {
    const from = { x: 0, y: 0 };
    const to = { x: 1, y: 0 };
    const key = edgeKeyBetween(from, to)!;
    expect(isCrossingBlocked([key], from, to)).toBe(true);
    expect(isCrossingBlocked([key], to, from)).toBe(true);
    expect(isCrossingBlocked([], from, to)).toBe(false);
  });

  it("places exactly count walls while staying connected", () => {
    const grid = { width: 7, height: 7 };
    const walls = generateConnectedEdgeWalls(grid, { count: 15, seed: 42 });
    expect(walls).toHaveLength(15);
    expect(new Set(walls).size).toBe(15);
    expect(isGridConnected(grid, walls)).toBe(true);

    const again = generateConnectedEdgeWalls(grid, { count: 15, seed: 42 });
    expect(again).toEqual(walls);
  });

  it("lists all internal edges", () => {
    const edges = listInternalEdges({ width: 2, height: 2 });
    expect(edges).toHaveLength(4);
  });

  it("reports hasEdgeWall symmetrically", () => {
    const a = { x: 1, y: 1 };
    const b = { x: 1, y: 2 };
    const key = verticalEdgeKey(1, 1);
    expect(hasEdgeWall([key], a, b)).toBe(true);
    expect(hasEdgeWall([key], b, a)).toBe(true);
  });
});
