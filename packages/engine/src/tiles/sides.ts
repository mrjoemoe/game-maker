import type { Coord } from "../grid/index.js";

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

export function normalizeWalls(walls: TileSide[] | undefined): TileSide[] {
  if (!walls || walls.length === 0) {
    return [];
  }
  const seen = new Set<TileSide>();
  for (const side of walls) {
    if (TILE_SIDES.includes(side)) {
      seen.add(side);
    }
  }
  return TILE_SIDES.filter((s) => seen.has(s));
}

export function tileHasWall(
  walls: TileSide[] | undefined,
  side: TileSide,
): boolean {
  return (walls ?? []).includes(side);
}

/**
 * Crossing from `from` to `to` is blocked if the origin has a wall on the exit
 * side or the destination has a wall on the entry side.
 */
export function isCrossingBlocked(
  fromWalls: TileSide[] | undefined,
  toWalls: TileSide[] | undefined,
  from: Coord,
  to: Coord,
): boolean {
  const exit = sideToward(from, to);
  if (!exit) {
    return true;
  }
  return (
    tileHasWall(fromWalls, exit) || tileHasWall(toWalls, oppositeSide(exit))
  );
}

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

export type SideWallWeights = {
  /** Probability of 0 side walls. Default 0.7 */
  none?: number;
  /** Probability of 1 side wall. Default 0.25 */
  one?: number;
  /** Probability of 2 side walls. Default 0.05 */
  two?: number;
};

export type SideWallConfig = {
  weights?: SideWallWeights;
  /** Stable seed so full reset rebuilds the same wall layout. */
  seed?: number;
};

function pickWallCount(
  random: () => number,
  weights: Required<SideWallWeights>,
): 0 | 1 | 2 {
  const total = weights.none + weights.one + weights.two;
  const roll = random() * total;
  if (roll < weights.none) return 0;
  if (roll < weights.none + weights.one) return 1;
  return 2;
}

function pickSides(random: () => number, count: 0 | 1 | 2): TileSide[] {
  if (count === 0) return [];
  const pool = [...TILE_SIDES];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

/** Assign 0–2 random side walls to every cell (any orientation). */
export function generateSideWalls(
  cellKeys: string[],
  config: SideWallConfig,
): Record<string, TileSide[]> {
  const weights: Required<SideWallWeights> = {
    none: config.weights?.none ?? 0.7,
    one: config.weights?.one ?? 0.25,
    two: config.weights?.two ?? 0.05,
  };
  const random = createSeededRandom(config.seed ?? 1);
  const result: Record<string, TileSide[]> = {};
  for (const key of cellKeys) {
    const count = pickWallCount(random, weights);
    result[key] = pickSides(random, count);
  }
  return result;
}
