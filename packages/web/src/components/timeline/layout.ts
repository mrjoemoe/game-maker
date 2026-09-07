import type { TimelineState } from "@game-maker/engine";

export const NODE_W = 120;
export const NODE_H = 44;
export const LANE_W = 176;
export const ROW_H = 64;
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
