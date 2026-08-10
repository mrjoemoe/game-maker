import { describe, expect, it } from "vitest";
import {
  generateSideWalls,
  isCrossingBlocked,
  oppositeSide,
  sideToward,
} from "./sides.js";

describe("tile sides", () => {
  it("maps neighbor direction to a side", () => {
    expect(sideToward({ x: 1, y: 1 }, { x: 1, y: 0 })).toBe("n");
    expect(sideToward({ x: 1, y: 1 }, { x: 2, y: 1 })).toBe("e");
    expect(oppositeSide("n")).toBe("s");
  });

  it("blocks crossing when either tile walls the shared edge", () => {
    const from = { x: 0, y: 0 };
    const to = { x: 1, y: 0 };
    expect(isCrossingBlocked(["e"], [], from, to)).toBe(true);
    expect(isCrossingBlocked([], ["w"], from, to)).toBe(true);
    expect(isCrossingBlocked(["n"], ["n"], from, to)).toBe(false);
  });

  it("generates mostly empty walls with a stable seed", () => {
    const keys = Array.from({ length: 49 }, (_, i) => `c${i}`);
    const a = generateSideWalls(keys, {
      seed: 42,
      weights: { none: 0.7, one: 0.25, two: 0.05 },
    });
    const b = generateSideWalls(keys, {
      seed: 42,
      weights: { none: 0.7, one: 0.25, two: 0.05 },
    });
    expect(a).toEqual(b);

    const counts = { 0: 0, 1: 0, 2: 0 };
    for (const walls of Object.values(a)) {
      counts[walls.length as 0 | 1 | 2] += 1;
    }
    expect(counts[0]).toBeGreaterThan(counts[1]);
    expect(counts[1]).toBeGreaterThan(counts[2]);
    expect(counts[0] + counts[1] + counts[2]).toBe(49);
  });
});
