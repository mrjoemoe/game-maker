import type { TimelineState } from "@game-maker/engine";

export const NODE_W = 120;
export const NODE_H = 44;
export const LANE_W = 160;
export const ROW_H = 56;
export const RULER_W = 32;
export const MAT_W = 120;
export const MAT_H = 72;
export const PAD = 16;
export const MAX_TRACK_ROWS = 20;

export type NodeLayout = {
  id: string;
  x: number;
  y: number;
  lane: number;
  row: number;
};

export type MatLayout = {
  branchId: string;
  x: number;
  y: number;
};

export type RowLayout = {
  row: number;
  y: number;
};

export type TimelineLayout = {
  width: number;
  height: number;
  nodes: Record<string, NodeLayout>;
  mats: Record<string, MatLayout>;
  lanes: Record<string, number>;
  rows: RowLayout[];
  epochY: number;
};

export function layoutTimeline(state: TimelineState): TimelineLayout {
  const branches = Object.values(state.branches).sort(
    (a, b) => a.index - b.index,
  );
  const lanes: Record<string, number> = {};
  branches.forEach((branch, i) => {
    lanes[branch.id] = i;
  });

  const maxDepth = Math.max(
    MAX_TRACK_ROWS,
    ...Object.values(state.nodes).map((n) => n.depth),
  );
  const matStrip = MAT_H + 10;
  const height = PAD + matStrip + (maxDepth + 1) * ROW_H + PAD;

  const yForDepth = (depth: number) =>
    height - PAD - matStrip - NODE_H - depth * ROW_H;

  const nodes: Record<string, NodeLayout> = {};
  for (const node of Object.values(state.nodes)) {
    const lane = lanes[node.branchId] ?? 0;
    nodes[node.id] = {
      id: node.id,
      x: RULER_W + PAD + lane * LANE_W,
      y: yForDepth(node.depth),
      lane,
      row: node.depth,
    };
  }

  const mats: Record<string, MatLayout> = {};
  for (const branch of branches) {
    const lane = lanes[branch.id] ?? 0;
    const root = nodes[branch.rootNodeId];
    const primary = branch.id === state.primaryBranchId;
    mats[branch.id] = {
      branchId: branch.id,
      x: RULER_W + PAD + lane * LANE_W,
      y: primary
        ? height - PAD - MAT_H
        : root
          ? root.y + NODE_H + 4
          : height - PAD - MAT_H,
    };
  }

  const rows: RowLayout[] = [];
  for (let row = 1; row <= maxDepth; row += 1) {
    rows.push({ row, y: yForDepth(row) });
  }

  const width = Math.max(
    520,
    RULER_W + PAD + Math.max(1, branches.length) * LANE_W + PAD,
  );

  return {
    width,
    height,
    nodes,
    mats,
    lanes,
    rows,
    epochY: yForDepth(0),
  };
}

export type WireKind = "stem" | "fork" | "merge";

export function wireKind(
  parent: { branchId: string },
  child: { branchId: string; parentIds: string[] },
): WireKind {
  if (child.parentIds.length > 1) return "merge";
  if (parent.branchId !== child.branchId) return "fork";
  return "stem";
}

function gutterX(from: NodeLayout, to: NodeLayout): number {
  if (to.x >= from.x) {
    return from.x + NODE_W + (to.x - from.x - NODE_W) / 2;
  }
  return to.x + NODE_W + (from.x - to.x - NODE_W) / 2;
}

export function wirePath(
  from: NodeLayout,
  to: NodeLayout,
  kind: WireKind,
): string {
  const fromCx = from.x + NODE_W / 2;
  const toCx = to.x + NODE_W / 2;
  if (kind === "stem") {
    return `M ${fromCx} ${from.y} L ${toCx} ${to.y + NODE_H}`;
  }

  const goingRight = to.x >= from.x;
  const startX = goingRight ? from.x + NODE_W : from.x;
  const startY = from.y + 12;
  const endX = goingRight ? to.x : to.x + NODE_W;
  const endY = to.y + NODE_H / 2;
  const gx = gutterX(from, to);
  return `M ${startX} ${startY} L ${gx} ${startY} L ${gx} ${endY} L ${endX} ${endY}`;
}
