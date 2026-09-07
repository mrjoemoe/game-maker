import assert from "node:assert/strict";
import type { TimelineBranch, TimelineNode, TimelineState } from "@game-maker/engine";
import {
  NODE_W,
  assignBranchSlots,
  layoutTimeline,
} from "./layout.ts";

function branch(
  id: string,
  index: number,
  parentBranchId: string | null,
  rootNodeId: string,
): TimelineBranch {
  return {
    id,
    index,
    label: id,
    headNodeId: rootNodeId,
    rootNodeId,
    parentBranchId,
    forkNodeId: parentBranchId,
    crystals: 0,
  };
}

function node(
  id: string,
  branchId: string,
  depth: number,
  parentIds: string[],
  childIds: string[],
): TimelineNode {
  return {
    id,
    branchId,
    depth,
    parentIds,
    childIds,
    card: null,
    revealed: true,
  };
}

function stateWith(
  branches: Record<string, TimelineBranch>,
  nodes: Record<string, TimelineNode>,
): TimelineState {
  return {
    nodes,
    branches,
    epochNodeId: "n0",
    primaryBranchId: "b1",
    travelerNodeId: "n0",
    hand: [],
    actionDeck: [],
    omegaDeck: [],
    blueprintDeck: [],
    player: {
      parts: 0,
      minerals: 0,
      crystals: 0,
      devices: [],
      blueprints: [],
      objectives: [],
      pendingClaimIds: [],
      completedCount: 0,
    },
    debugMode: true,
    status: "playing",
    log: [],
    nextId: 10,
    rngSeed: 1,
  };
}

const prime = stateWith(
  { b1: branch("b1", 1, null, "n0") },
  {
    n0: node("n0", "b1", 0, [], ["n1"]),
    n1: node("n1", "b1", 1, ["n0"], []),
  },
);

const primeSlots = assignBranchSlots(prime);
assert.equal(primeSlots.b1, 0);

const primeLayout = layoutTimeline(prime, 900);
assert.equal(primeLayout.laneCount, 3);
assert.ok(
  Math.abs(primeLayout.nodes.n0!.x + NODE_W / 2 - 900 / 2) < 32,
  "primary column should sit near the horizontal center",
);

const forked = stateWith(
  {
    b1: branch("b1", 1, null, "n0"),
    b2: branch("b2", 2, "b1", "n2"),
    b3: branch("b3", 3, "b1", "n3"),
  },
  {
    n0: node("n0", "b1", 0, [], ["n1", "n2", "n3"]),
    n1: node("n1", "b1", 1, ["n0"], []),
    n2: node("n2", "b2", 1, ["n0"], []),
    n3: node("n3", "b3", 1, ["n0"], []),
  },
);

const forkSlots = assignBranchSlots(forked);
assert.equal(forkSlots.b1, 0);
assert.equal(forkSlots.b2, -1);
assert.equal(forkSlots.b3, 1);

const forkLayout = layoutTimeline(forked);
assert.ok(forkLayout.nodes.n2!.x < forkLayout.nodes.n0!.x);
assert.ok(forkLayout.nodes.n3!.x > forkLayout.nodes.n0!.x);
assert.equal(
  forkLayout.nodes.n0!.x - forkLayout.nodes.n2!.x,
  forkLayout.nodes.n3!.x - forkLayout.nodes.n0!.x,
);

console.log("layout ok");
