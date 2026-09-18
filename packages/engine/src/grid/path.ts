import { coordKey, isInBounds, neighbors, type Coord, type GridConfig } from "./index.js";
import {
  destinationFrom,
  directionBetween,
  type Direction,
} from "./directions.js";

export type WalkBlockers = {
  isCrossingBlocked?: (from: Coord, to: Coord) => boolean;
  isCellBlocked?: (coord: Coord) => boolean;
};

export function projectWalk(origin: Coord, directions: Direction[]): Coord {
  let pos = { ...origin };
  for (const direction of directions) {
    pos = destinationFrom(pos, direction);
  }
  return pos;
}

function reconstruct(
  cameFrom: Map<string, { prev: Coord; dir: Direction }>,
  origin: Coord,
  goal: Coord,
): Direction[] {
  const dirs: Direction[] = [];
  let current = goal;
  while (current.x !== origin.x || current.y !== origin.y) {
    const step = cameFrom.get(coordKey(current));
    if (!step) return [];
    dirs.push(step.dir);
    current = step.prev;
  }
  dirs.reverse();
  return dirs;
}

export function shortestWalkDirections(
  grid: GridConfig,
  from: Coord,
  to: Coord,
  blockers: WalkBlockers = {},
): Direction[] | null {
  if (!isInBounds(grid, from) || !isInBounds(grid, to)) {
    return null;
  }
  if (from.x === to.x && from.y === to.y) {
    return [];
  }
  if (blockers.isCellBlocked?.(to)) {
    return null;
  }

  const startKey = coordKey(from);
  const goalKey = coordKey(to);
  const seen = new Set<string>([startKey]);
  const queue: Coord[] = [from];
  const cameFrom = new Map<string, { prev: Coord; dir: Direction }>();

  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const next of neighbors(grid, current)) {
      const key = coordKey(next);
      if (seen.has(key)) continue;
      if (blockers.isCellBlocked?.(next)) continue;
      if (blockers.isCrossingBlocked?.(current, next)) continue;
      const dir = directionBetween(current, next);
      if (!dir) continue;
      seen.add(key);
      cameFrom.set(key, { prev: current, dir });
      if (key === goalKey) {
        return reconstruct(cameFrom, from, to);
      }
      queue.push(next);
    }
  }

  return null;
}
