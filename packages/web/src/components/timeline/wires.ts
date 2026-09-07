import type { TimelineState } from "@game-maker/engine";
import {
  LANE_W,
  MAT_H,
  MAT_W,
  NODE_H,
  NODE_W,
  ROW_H,
  type NodeLayout,
  type TimelineLayout,
} from "./layout";

export type WireKind = "stem" | "fork" | "merge";

export type WireLabel = {
  letter: string;
  x: number;
  y: number;
};

export type PlannedWire = {
  key: string;
  kind: WireKind;
  parts: string[];
  labels: WireLabel[];
};

type Point = { x: number; y: number };

export type Obstacle = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

const PAD = 3;
const STUB = 20;
const CELL = 8;
const LETTERS = "abcdefghijklmnopqrstuvwxyz";

export function wireKind(
  parent: { branchId: string },
  child: { branchId: string; parentIds: string[] },
): WireKind {
  if (child.parentIds.length > 1) return "merge";
  if (parent.branchId !== child.branchId) return "fork";
  return "stem";
}

export function planWires(
  state: TimelineState,
  layout: TimelineLayout,
): PlannedWire[] {
  const obstacles = collectObstacles(layout);
  let jumpIndex = 0;
  const wires: PlannedWire[] = [];
  for (const node of Object.values(state.nodes)) {
    for (const parentId of node.parentIds) {
      const parent = state.nodes[parentId];
      const from = layout.nodes[parentId];
      const to = layout.nodes[node.id];
      if (!parent || !from || !to) continue;
      const kind = wireKind(parent, node);
      const planned = routePair(
        from,
        to,
        kind,
        `${parentId}-${node.id}`,
        obstacles,
        layout,
        () => {
          const letter = jumpLetter(jumpIndex);
          jumpIndex += 1;
          return letter;
        },
      );
      wires.push(planned);
    }
  }
  return wires;
}

export function jumpLetter(index: number): string {
  if (index < LETTERS.length) return LETTERS[index] ?? "a";
  const loop = index - LETTERS.length;
  return `${LETTERS[loop % LETTERS.length] ?? "a"}${Math.floor(loop / LETTERS.length) + 2}`;
}

function collectObstacles(layout: TimelineLayout): Obstacle[] {
  const nodes = Object.values(layout.nodes).map((node) => ({
    id: node.id,
    x: node.x,
    y: node.y,
    w: NODE_W,
    h: NODE_H,
  }));
  const mats = Object.values(layout.mats).map((mat) => ({
    id: `mat:${mat.branchId}`,
    x: mat.x,
    y: mat.y,
    w: MAT_W,
    h: MAT_H,
  }));
  return [...nodes, ...mats];
}

export function routePair(
  from: NodeLayout,
  to: NodeLayout,
  kind: WireKind,
  key: string,
  obstacles: Obstacle[],
  layout: TimelineLayout,
  nextLetter: () => string,
): PlannedWire {
  const ignore = new Set([from.id, to.id]);
  if (kind === "stem") {
    const start = { x: from.x + NODE_W / 2, y: from.y };
    const end = { x: to.x + NODE_W / 2, y: to.y + NODE_H };
    const stem = [start, end];
    if (polylineClear(stem, obstacles, ignore)) {
      return { key, kind, parts: [toPath(stem)], labels: [] };
    }
  }

  const points = findClearPath(from, to, obstacles, ignore, layout);
  if (points) {
    return { key, kind, parts: [toPath(points)], labels: [] };
  }
  return jumpWire(from, to, kind, key, nextLetter());
}

function findClearPath(
  from: NodeLayout,
  to: NodeLayout,
  obstacles: Obstacle[],
  ignore: Set<string>,
  layout: TimelineLayout,
): Point[] | null {
  const box = searchBox(from, to, layout);
  const goingRight = to.x >= from.x;
  const starts = facingPorts(from, goingRight ? "right" : "left");
  const ends = facingPorts(to, goingRight ? "left" : "right");
  const midX = (from.x + to.x + NODE_W) / 2;
  const midY = (from.y + to.y + NODE_H) / 2;
  const vxs = verticalChannels(layout)
    .filter((x) => x >= box.x && x <= box.x + box.w)
    .sort((a, b) => Math.abs(a - midX) - Math.abs(b - midX));
  const hys = horizontalChannels(layout)
    .filter((y) => y >= box.y && y <= box.y + box.h)
    .sort((a, b) => Math.abs(a - midY) - Math.abs(b - midY));
  for (const start of starts) {
    for (const end of ends) {
      for (const vx1 of vxs) {
        for (const vx2 of vxs) {
          for (const hy of hys) {
            const pts = viaChannels(start, end, vx1, hy, vx2);
            if (polylineClear(pts, obstacles, ignore)) return pts;
          }
        }
      }
    }
  }
  return astarPath(from, to, obstacles, ignore, box);
}

function facingPorts(node: NodeLayout, side: "left" | "right"): Point[] {
  const x = side === "right" ? node.x + NODE_W : node.x;
  return [
    { x, y: node.y + 8 },
    { x, y: node.y + NODE_H / 2 },
    { x, y: node.y + NODE_H - 8 },
    { x: node.x + NODE_W / 2, y: node.y },
    { x: node.x + NODE_W / 2, y: node.y + NODE_H },
  ];
}

function searchBox(
  from: NodeLayout,
  to: NodeLayout,
  layout: TimelineLayout,
): { x: number; y: number; w: number; h: number } {
  const minX = Math.min(from.x, to.x) - LANE_W;
  const maxX = Math.max(from.x + NODE_W, to.x + NODE_W) + LANE_W;
  const minY = Math.min(from.y, to.y) - ROW_H;
  const maxY = Math.max(from.y + NODE_H, to.y + NODE_H) + ROW_H;
  const x = Math.max(0, minX);
  const y = Math.max(0, minY);
  return {
    x,
    y,
    w: Math.min(layout.width, maxX) - x,
    h: Math.min(layout.height, maxY) - y,
  };
}

function verticalChannels(layout: TimelineLayout): number[] {
  const laneCount = Math.max(1, layout.laneCount);
  const origin = layout.originX;
  const gutter = (LANE_W - NODE_W) / 2;
  const xs: number[] = [Math.max(8, origin - gutter)];
  for (let i = 0; i < laneCount; i += 1) {
    xs.push(origin + i * LANE_W + NODE_W + gutter);
  }
  return uniqueSorted(xs);
}

function horizontalChannels(layout: TimelineLayout): number[] {
  const gap = ROW_H - NODE_H;
  const ys = new Set<number>();
  for (const node of Object.values(layout.nodes)) {
    ys.add(node.y - gap / 2);
    ys.add(node.y + NODE_H + gap / 2);
  }
  return uniqueSorted([...ys]);
}

function uniqueSorted(values: number[]): number[] {
  return [...new Set(values.map((v) => Math.round(v)))].sort((a, b) => a - b);
}

function viaChannels(
  start: Point,
  end: Point,
  vx1: number,
  hy: number,
  vx2: number,
): Point[] {
  return simplify([
    start,
    { x: vx1, y: start.y },
    { x: vx1, y: hy },
    { x: vx2, y: hy },
    { x: vx2, y: end.y },
    end,
  ]);
}

function simplify(points: Point[]): Point[] {
  const rounded = points.map((p) => ({
    x: Math.round(p.x),
    y: Math.round(p.y),
  }));
  const dedup: Point[] = [];
  for (const point of rounded) {
    const last = dedup[dedup.length - 1];
    if (last && last.x === point.x && last.y === point.y) continue;
    dedup.push(point);
  }
  const out: Point[] = [];
  for (const point of dedup) {
    const a = out[out.length - 2];
    const b = out[out.length - 1];
    if (
      a &&
      b &&
      ((a.x === b.x && b.x === point.x) || (a.y === b.y && b.y === point.y))
    ) {
      out[out.length - 1] = point;
      continue;
    }
    out.push(point);
  }
  return out;
}

export function polylineClear(
  points: Point[],
  obstacles: Obstacle[],
  ignore: Set<string>,
): boolean {
  for (let i = 1; i < points.length; i += 1) {
    const a = points[i - 1];
    const b = points[i];
    if (!a || !b) continue;
    if (segmentHits(a, b, obstacles, ignore)) return false;
  }
  return points.length >= 2;
}

function segmentHits(
  a: Point,
  b: Point,
  obstacles: Obstacle[],
  ignore: Set<string>,
): boolean {
  const minX = Math.min(a.x, b.x) - PAD;
  const maxX = Math.max(a.x, b.x) + PAD;
  const minY = Math.min(a.y, b.y) - PAD;
  const maxY = Math.max(a.y, b.y) + PAD;
  for (const obstacle of obstacles) {
    if (ignore.has(obstacle.id)) continue;
    if (maxX < obstacle.x || minX > obstacle.x + obstacle.w) continue;
    if (maxY < obstacle.y || minY > obstacle.y + obstacle.h) continue;
    return true;
  }
  return false;
}

function toPath(points: Point[]): string {
  const first = points[0];
  if (!first) return "";
  return points
    .map((point, i) =>
      i === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`,
    )
    .join(" ");
}

function jumpWire(
  from: NodeLayout,
  to: NodeLayout,
  kind: WireKind,
  key: string,
  letter: string,
): PlannedWire {
  const goingRight = to.x >= from.x;
  const start = goingRight
    ? { x: from.x + NODE_W, y: from.y + NODE_H / 2 }
    : { x: from.x, y: from.y + NODE_H / 2 };
  const end = goingRight
    ? { x: to.x, y: to.y + NODE_H / 2 }
    : { x: to.x + NODE_W, y: to.y + NODE_H / 2 };
  const dx = goingRight ? STUB : -STUB;
  const a = { x: start.x + dx, y: start.y };
  const b = { x: end.x - dx, y: end.y };
  return {
    key,
    kind,
    parts: [toPath([start, a]), toPath([b, end])],
    labels: [
      { letter, x: a.x, y: a.y },
      { letter, x: b.x, y: b.y },
    ],
  };
}

function astarPath(
  from: NodeLayout,
  to: NodeLayout,
  obstacles: Obstacle[],
  ignore: Set<string>,
  box: { x: number; y: number; w: number; h: number },
): Point[] | null {
  const goingRight = to.x >= from.x;
  const start = facingPorts(from, goingRight ? "right" : "left")[0];
  const goal = facingPorts(to, goingRight ? "left" : "right")[0];
  if (!start || !goal) return null;
  const minX = Math.floor(box.x / CELL);
  const minY = Math.floor(box.y / CELL);
  const maxX = Math.ceil((box.x + box.w) / CELL);
  const maxY = Math.ceil((box.y + box.h) / CELL);
  const cols = maxX - minX + 1;
  const rows = maxY - minY + 1;
  if (cols < 2 || rows < 2 || cols * rows > 8000) return null;

  const blocked = (cx: number, cy: number) => {
    if (cx < minX || cy < minY || cx > maxX || cy > maxY) return true;
    const x = cx * CELL + CELL / 2;
    const y = cy * CELL + CELL / 2;
    for (const obstacle of obstacles) {
      if (ignore.has(obstacle.id)) continue;
      if (
        x >= obstacle.x - PAD &&
        x <= obstacle.x + obstacle.w + PAD &&
        y >= obstacle.y - PAD &&
        y <= obstacle.y + obstacle.h + PAD
      ) {
        return true;
      }
    }
    return false;
  };

  const sx = Math.round(start.x / CELL);
  const sy = Math.round(start.y / CELL);
  const gx = Math.round(goal.x / CELL);
  const gy = Math.round(goal.y / CELL);
  if (blocked(sx, sy) || blocked(gx, gy)) return null;

  const keyOf = (x: number, y: number) => (y - minY) * cols + (x - minX);
  const heap: { f: number; x: number; y: number }[] = [];
  const gScore = new Float64Array(cols * rows).fill(Infinity);
  const cameX = new Int16Array(cols * rows).fill(-1);
  const cameY = new Int16Array(cols * rows).fill(-1);
  const startKey = keyOf(sx, sy);
  gScore[startKey] = 0;
  heap.push({ f: Math.abs(gx - sx) + Math.abs(gy - sy), x: sx, y: sy });

  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  while (heap.length) {
    let bestI = 0;
    for (let i = 1; i < heap.length; i += 1) {
      if ((heap[i]?.f ?? Infinity) < (heap[bestI]?.f ?? Infinity)) bestI = i;
    }
    const current = heap.splice(bestI, 1)[0];
    if (!current) break;
    if (current.x === gx && current.y === gy) {
      const cells: Point[] = [];
      let x = current.x;
      let y = current.y;
      while (x >= 0) {
        cells.push({ x: x * CELL, y: y * CELL });
        const k = keyOf(x, y);
        const px = cameX[k] ?? -1;
        const py = cameY[k] ?? -1;
        if (px < 0 || py < 0) break;
        x = px;
        y = py;
      }
      cells.reverse();
      cells[0] = start;
      cells[cells.length - 1] = goal;
      const path = simplify(cells);
      if (polylineClear(path, obstacles, ignore)) return path;
      return null;
    }
    const ck = keyOf(current.x, current.y);
    const g = gScore[ck] ?? Infinity;
    for (const [dx, dy] of dirs) {
      const nx = current.x + (dx ?? 0);
      const ny = current.y + (dy ?? 0);
      if (blocked(nx, ny)) continue;
      const nk = keyOf(nx, ny);
      const tentative = g + 1;
      if (tentative >= (gScore[nk] ?? Infinity)) continue;
      gScore[nk] = tentative;
      cameX[nk] = current.x;
      cameY[nk] = current.y;
      heap.push({
        f: tentative + Math.abs(gx - nx) + Math.abs(gy - ny),
        x: nx,
        y: ny,
      });
    }
  }
  return null;
}
