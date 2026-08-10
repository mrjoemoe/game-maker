import type { Coord } from "./index.js";

export type Direction = "up" | "down" | "left" | "right";

export const DIRECTIONS: Direction[] = ["up", "down", "left", "right"];

export function directionDelta(direction: Direction): Coord {
  switch (direction) {
    case "up":
      return { x: 0, y: -1 };
    case "down":
      return { x: 0, y: 1 };
    case "left":
      return { x: -1, y: 0 };
    case "right":
      return { x: 1, y: 0 };
    default: {
      const _exhaustive: never = direction;
      return _exhaustive;
    }
  }
}

export function destinationFrom(origin: Coord, direction: Direction): Coord {
  const delta = directionDelta(direction);
  return { x: origin.x + delta.x, y: origin.y + delta.y };
}

export function directionLabel(direction: Direction): string {
  switch (direction) {
    case "up":
      return "↑";
    case "down":
      return "↓";
    case "left":
      return "←";
    case "right":
      return "→";
    default: {
      const _exhaustive: never = direction;
      return _exhaustive;
    }
  }
}
