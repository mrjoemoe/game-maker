import type { TimelineBranch, TimelineState } from "@game-maker/engine";

export const NODE_W = 120;
export const NODE_H = 44;
export const LANE_W = 176;
export const ROW_H = 64;
export const RULER_W = 32;
export const MAT_W = 120;
export const MAT_H = 72;
export const PAD = 16;
export const MAX_TRACK_ROWS = 20;
const MIN_WIDTH = 520;

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
  laneCount: number;
  originX: number;
  rows: RowLayout[];
  epochY: number;
};

export function assignBranchSlots(
  state: Pick<TimelineState, "branches" | "primaryBranchId">,
): Record<string, number> {
  const slots: Record<string, number> = {};
  const used = new Set<number>();
  const kids = childBranches(state);

  const place = (branchId: string, preferred: number) => {
    let slot = preferred;
    const dir = preferred >= 0 ? 1 : -1;
    while (used.has(slot)) slot += dir;
    slots[branchId] = slot;
    used.add(slot);
    const children = kids.get(branchId) ?? [];
    children.forEach((child, i) => {
      const side = i % 2 === 0 ? -1 : 1;
      let next = slot + side;
      while (used.has(next)) next += side;
      place(child.id, next);
    });
  };

  if (state.branches[state.primaryBranchId]) {
    place(state.primaryBranchId, 0);
  }

  const leftovers = Object.values(state.branches)
    .filter((branch) => slots[branch.id] === undefined)
    .sort((a, b) => a.index - b.index);
  for (const branch of leftovers) {
    if (slots[branch.id] !== undefined) continue;
    let slot = 1;
    while (used.has(slot)) slot += 1;
    place(branch.id, slot);
  }

  return slots;
}

function childBranches(
  state: Pick<TimelineState, "branches" | "primaryBranchId">,
): Map<string, TimelineBranch[]> {
  const kids = new Map<string, TimelineBranch[]>();
  for (const branch of Object.values(state.branches)) {
    if (branch.id === state.primaryBranchId) continue;
    const parentId = branch.parentBranchId;
    if (!parentId || !state.branches[parentId]) continue;
    const list = kids.get(parentId) ?? [];
    list.push(branch);
    kids.set(parentId, list);
  }
  for (const list of kids.values()) {
    list.sort((a, b) => a.index - b.index);
  }
  return kids;
}

export function layoutTimeline(
  state: TimelineState,
  viewportWidth = 0,
): TimelineLayout {
  const slots = assignBranchSlots(state);
  const occupied = Object.values(slots);
  const minSlot = occupied.length ? Math.min(...occupied, 0) : 0;
  const maxSlot = occupied.length ? Math.max(...occupied, 0) : 0;
  const half = Math.max(-minSlot, maxSlot, 1);
  const laneCount = half * 2 + 1;
  const lanes: Record<string, number> = {};
  for (const [branchId, slot] of Object.entries(slots)) {
    lanes[branchId] = slot + half;
  }

  const maxDepth = Math.max(
    MAX_TRACK_ROWS,
    ...Object.values(state.nodes).map((n) => n.depth),
  );
  const matStrip = MAT_H + 10;
  const height = PAD + matStrip + (maxDepth + 1) * ROW_H + PAD;

  const yForDepth = (depth: number) =>
    height - PAD - matStrip - NODE_H - depth * ROW_H;

  const treeWidth = laneCount * LANE_W;
  const width = Math.max(
    MIN_WIDTH,
    RULER_W + PAD + treeWidth + PAD,
    viewportWidth,
  );
  const contentLeft = RULER_W + PAD;
  const extra = Math.max(0, width - contentLeft - PAD - treeWidth);
  const originX = contentLeft + extra / 2;

  const nodes: Record<string, NodeLayout> = {};
  for (const node of Object.values(state.nodes)) {
    const lane = lanes[node.branchId] ?? half;
    nodes[node.id] = {
      id: node.id,
      x: originX + lane * LANE_W,
      y: yForDepth(node.depth),
      lane,
      row: node.depth,
    };
  }

  const mats: Record<string, MatLayout> = {};
  for (const branch of Object.values(state.branches)) {
    const lane = lanes[branch.id] ?? half;
    const root = nodes[branch.rootNodeId];
    const primary = branch.id === state.primaryBranchId;
    mats[branch.id] = {
      branchId: branch.id,
      x: originX + lane * LANE_W,
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

  return {
    width,
    height,
    nodes,
    mats,
    lanes,
    laneCount,
    originX,
    rows,
    epochY: yForDepth(0),
  };
}
