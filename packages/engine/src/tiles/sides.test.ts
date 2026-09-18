import { describe, expect, it } from "vitest";
import {
  edgeKeyBetween,
  edgeWallSegments,
  generateConnectedEdgeWalls,
  hasEdgeWall,
  isCrossingBlocked,
  isGridConnected,
  listInternalEdges,
  parseEdgeWallKey,
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

  it("parses horizontal and vertical wall keys into segments", () => {
    expect(parseEdgeWallKey("h:1,2")).toEqual({ axis: "h", x: 1, y: 2 });
    expect(parseEdgeWallKey("v:0,0")).toEqual({ axis: "v", x: 0, y: 0 });
    expect(parseEdgeWallKey("nope")).toBeNull();
    expect(edgeWallSegments(["h:1,2", "nope", "v:0,0"])).toEqual([
      { axis: "h", x: 1, y: 2 },
      { axis: "v", x: 0, y: 0 },
    ]);
  });
});
