import {
  allCoords,
  coordKey,
  neighbors,
  type Coord,
  type GridConfig,
} from "../grid/index.js";

/** Orthogonal sides of a tile (screen: n=top, s=bottom, e=right, w=left). */
export type TileSide = "n" | "e" | "s" | "w";

export const TILE_SIDES: TileSide[] = ["n", "e", "s", "w"];

export function oppositeSide(side: TileSide): TileSide {
  switch (side) {
    case "n":
      return "s";
    case "s":
      return "n";
    case "e":
      return "w";
    case "w":
      return "e";
    default: {
      const _exhaustive: never = side;
      return _exhaustive;
    }
  }
}

/** Side of `from` that faces `to`, or null if not orthogonal neighbors. */
export function sideToward(from: Coord, to: Coord): TileSide | null {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (dx === 1 && dy === 0) return "e";
  if (dx === -1 && dy === 0) return "w";
  if (dx === 0 && dy === 1) return "s";
  if (dx === 0 && dy === -1) return "n";
  return null;
}

/**
 * Undirected edge between orthogonally adjacent cells.
 * - `h:x,y` — wall between `(x,y)` and `(x+1,y)` (east/west shared edge)
 * - `v:x,y` — wall between `(x,y)` and `(x,y+1)` (north/south shared edge)
 */
export type EdgeWallKey = `h:${number},${number}` | `v:${number},${number}`;

export type EdgeWallConfig = {
  /** Exact number of edge walls to place. */
  count: number;
  /** PRNG seed. Omitted or overridden on New map rerolls. */
  seed?: number;
};

/** Mulberry32 — small deterministic PRNG from a 32-bit seed. */
export function createSeededRandom(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function horizontalEdgeKey(x: number, y: number): EdgeWallKey {
  return `h:${x},${y}`;
}

export function verticalEdgeKey(x: number, y: number): EdgeWallKey {
  return `v:${x},${y}`;
}

/** Canonical edge key between two orthogonal neighbors, or null. */
export function edgeKeyBetween(a: Coord, b: Coord): EdgeWallKey | null {
  const exit = sideToward(a, b);
  if (!exit) return null;
  if (exit === "e") return horizontalEdgeKey(a.x, a.y);
  if (exit === "w") return horizontalEdgeKey(b.x, b.y);
  if (exit === "s") return verticalEdgeKey(a.x, a.y);
  return verticalEdgeKey(b.x, b.y);
}

export function hasEdgeWall(
  edgeWalls: Iterable<string> | undefined,
  a: Coord,
  b: Coord,
): boolean {
  if (!edgeWalls) return false;
  const key = edgeKeyBetween(a, b);
  if (!key) return true;
  const set =
    edgeWalls instanceof Set ? edgeWalls : new Set(edgeWalls);
  return set.has(key);
}

/**
 * Crossing from `from` to `to` is blocked iff the shared edge has a wall.
 */
export function isCrossingBlocked(
  edgeWalls: Iterable<string> | undefined,
  from: Coord,
  to: Coord,
): boolean {
  return hasEdgeWall(edgeWalls, from, to);
}

export function listInternalEdges(grid: GridConfig): EdgeWallKey[] {
  const edges: EdgeWallKey[] = [];
  for (let y = 0; y < grid.height; y += 1) {
    for (let x = 0; x < grid.width - 1; x += 1) {
      edges.push(horizontalEdgeKey(x, y));
    }
  }
  for (let y = 0; y < grid.height - 1; y += 1) {
    for (let x = 0; x < grid.width; x += 1) {
      edges.push(verticalEdgeKey(x, y));
    }
  }
  return edges;
}

export function isGridConnected(
  grid: GridConfig,
  edgeWalls: Iterable<string>,
): boolean {
  const blocked = edgeWalls instanceof Set ? edgeWalls : new Set(edgeWalls);
  const cells = allCoords(grid);
  if (cells.length === 0) return true;
  const start = cells[0]!;
  const seen = new Set<string>();
  const queue: Coord[] = [start];
  seen.add(coordKey(start));
  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const next of neighbors(grid, current)) {
      const key = coordKey(next);
      if (seen.has(key)) continue;
      if (hasEdgeWall(blocked, current, next)) continue;
      seen.add(key);
      queue.push(next);
    }
  }
  return seen.size === cells.length;
}

/**
 * Place exactly `count` undirected edge walls without disconnecting the grid.
 * Greedy: shuffle candidates, add when the graph stays connected.
 */
export function generateConnectedEdgeWalls(
  grid: GridConfig,
  config: EdgeWallConfig,
): EdgeWallKey[] {
  const count = Math.max(0, Math.floor(config.count));
  const candidates = listInternalEdges(grid);
  if (count > candidates.length) {
    throw new Error(
      `Cannot place ${count} edge walls; grid only has ${candidates.length} internal edges`,
    );
  }

  const random = createSeededRandom(config.seed ?? 1);
  for (let i = candidates.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j]!, candidates[i]!];
  }

  const placed: EdgeWallKey[] = [];
  const blocked = new Set<string>();
  for (const edge of candidates) {
    if (placed.length >= count) break;
    blocked.add(edge);
    if (isGridConnected(grid, blocked)) {
      placed.push(edge);
    } else {
      blocked.delete(edge);
    }
  }

  if (placed.length < count) {
    throw new Error(
      `Could only place ${placed.length} of ${count} edge walls while keeping the map connected`,
    );
  }
  return placed;
}

export function clearEdgeWall(
  edgeWalls: readonly string[],
  from: Coord,
  to: Coord,
): string[] {
  const key = edgeKeyBetween(from, to);
  if (!key) return [...edgeWalls];
  return edgeWalls.filter((e) => e !== key);
}

/** Which faces of a cell border an edge wall (for UI). */
export function cellEdgeWallSides(
  edgeWalls: Iterable<string> | undefined,
  coord: Coord,
): TileSide[] {
  if (!edgeWalls) return [];
  const set =
    edgeWalls instanceof Set ? edgeWalls : new Set(edgeWalls);
  const sides: TileSide[] = [];
  if (coord.y > 0 && set.has(verticalEdgeKey(coord.x, coord.y - 1))) {
    sides.push("n");
  }
  if (set.has(verticalEdgeKey(coord.x, coord.y))) {
    sides.push("s");
  }
  if (coord.x > 0 && set.has(horizontalEdgeKey(coord.x - 1, coord.y))) {
    sides.push("w");
  }
  if (set.has(horizontalEdgeKey(coord.x, coord.y))) {
    sides.push("e");
  }
  return sides;
}

/** @deprecated Prefer EdgeWallConfig. */
export type SideWallConfig = EdgeWallConfig;
export type SideWallWeights = { none?: number; one?: number; two?: number };
