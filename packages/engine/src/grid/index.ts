export type Coord = {
  x: number;
  y: number;
};

export type GridConfig = {
  width: number;
  height: number;
};

export function createGrid(config: GridConfig): GridConfig {
  if (!Number.isInteger(config.width) || config.width < 1) {
    throw new Error(`Grid width must be a positive integer, got ${config.width}`);
  }
  if (!Number.isInteger(config.height) || config.height < 1) {
    throw new Error(`Grid height must be a positive integer, got ${config.height}`);
  }
  return { width: config.width, height: config.height };
}

export function isInBounds(grid: GridConfig, coord: Coord): boolean {
  return (
    Number.isInteger(coord.x) &&
    Number.isInteger(coord.y) &&
    coord.x >= 0 &&
    coord.y >= 0 &&
    coord.x < grid.width &&
    coord.y < grid.height
  );
}

/** Orthogonal (4-way) neighbors that lie inside the grid. */
export function neighbors(grid: GridConfig, coord: Coord): Coord[] {
  if (!isInBounds(grid, coord)) {
    return [];
  }
  const deltas: Coord[] = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
  ];
  return deltas
    .map((d) => ({ x: coord.x + d.x, y: coord.y + d.y }))
    .filter((c) => isInBounds(grid, c));
}

export function coordKey(coord: Coord): string {
  return `${coord.x},${coord.y}`;
}

export function parseCoordKey(key: string): Coord {
  const [xs, ys] = key.split(",");
  return { x: Number(xs), y: Number(ys) };
}

export function allCoords(grid: GridConfig): Coord[] {
  const coords: Coord[] = [];
  for (let y = 0; y < grid.height; y += 1) {
    for (let x = 0; x < grid.width; x += 1) {
      coords.push({ x, y });
    }
  }
  return coords;
}
