import assert from "node:assert/strict";
import {
  LANE_W,
  NODE_H,
  NODE_W,
  ROW_H,
  type NodeLayout,
  type TimelineLayout,
} from "./layout.ts";
import { jumpLetter, polylineClear, routePair } from "./wires.ts";

const from: NodeLayout = {
  id: "n0",
  x: 48,
  y: 400,
  lane: 0,
  row: 0,
};
const to: NodeLayout = {
  id: "n1",
  x: 48 + LANE_W,
  y: 400 - ROW_H,
  lane: 1,
  row: 1,
};

const layout: TimelineLayout = {
  width: 900,
  height: 700,
  nodes: { n0: from, n1: to },
  mats: {},
  lanes: { b1: 0, b2: 1 },
  laneCount: 2,
  originX: 48,
  rows: [],
  epochY: 400,
};

const cards = [
  { id: "n0", x: from.x, y: from.y, w: NODE_W, h: NODE_H },
  { id: "n1", x: to.x, y: to.y, w: NODE_W, h: NODE_H },
];

const clear = routePair(from, to, "fork", "n0-n1", cards, layout, () => "a");
assert.equal(clear.labels.length, 0, "adjacent fork should route around tiles");
assert.equal(clear.parts.length, 1);
assert.match(clear.parts[0] ?? "", /^M /);

assert.equal(
  polylineClear(
    [
      { x: 0, y: 30 },
      { x: 300, y: 30 },
    ],
    [{ id: "tile", x: 80, y: 10, w: NODE_W, h: NODE_H }],
    new Set(),
  ),
  false,
  "a stroke through a tile is blocked",
);

const boxed = routePair(
  from,
  to,
  "fork",
  "n0-n1",
  [...cards, { id: "fog", x: 0, y: 0, w: 900, h: 700 }],
  layout,
  () => "c",
);
assert.deepEqual(
  boxed.labels.map((label) => label.letter),
  ["c", "c"],
  "blocked local path should jump with the same letter",
);
assert.equal(boxed.parts.length, 2);
assert.equal(jumpLetter(0), "a");
assert.equal(jumpLetter(25), "z");

const ended: NodeLayout = {
  id: "ended",
  x: 48,
  y: 400,
  lane: 0,
  row: 2,
};
const destHead: NodeLayout = {
  id: "dest-head",
  x: 48 + LANE_W,
  y: 400 - ROW_H * 2,
  lane: 1,
  row: 4,
};
const mergeLayout: TimelineLayout = {
  ...layout,
  nodes: { ended, "dest-head": destHead },
};
const mergeCards = [
  { id: "ended", x: ended.x, y: ended.y, w: NODE_W, h: NODE_H },
  {
    id: "dest-head",
    x: destHead.x,
    y: destHead.y,
    w: NODE_W,
    h: NODE_H,
  },
  {
    id: "stem-card",
    x: destHead.x,
    y: destHead.y + ROW_H,
    w: NODE_W,
    h: NODE_H,
  },
];
const merge = routePair(
  ended,
  destHead,
  "merge",
  "merge:b1",
  mergeCards,
  mergeLayout,
  () => "m",
);
assert.equal(merge.kind, "merge");
assert.equal(merge.parts.length, 1);
const destStemX = destHead.x + NODE_W / 2;
assert.equal(
  merge.parts[0]?.includes(String(destStemX)),
  false,
  "merge wire must not ride the destination stem",
);

console.log("wires ok");
