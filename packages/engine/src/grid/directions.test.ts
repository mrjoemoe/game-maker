import { describe, expect, it } from "vitest";
import {
  destinationFrom,
  directionBetween,
  directionDelta,
  directionLabel,
  type Direction,
} from "./directions.js";

describe("directions", () => {
  it("maps each direction to a unit delta", () => {
    expect(directionDelta("up")).toEqual({ x: 0, y: -1 });
    expect(directionDelta("down")).toEqual({ x: 0, y: 1 });
    expect(directionDelta("left")).toEqual({ x: -1, y: 0 });
    expect(directionDelta("right")).toEqual({ x: 1, y: 0 });
  });

  it("computes destinations and labels", () => {
    expect(destinationFrom({ x: 3, y: 6 }, "up")).toEqual({ x: 3, y: 5 });
    const dirs: Direction[] = ["up", "down", "left", "right"];
    expect(dirs.map(directionLabel)).toEqual(["↑", "↓", "←", "→"]);
    expect(directionBetween({ x: 0, y: 0 }, { x: 1, y: 0 })).toBe("right");
    expect(directionBetween({ x: 0, y: 0 }, { x: 2, y: 0 })).toBeNull();
  });
});
