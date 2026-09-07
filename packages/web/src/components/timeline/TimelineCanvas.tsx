import {
  cardById,
  isBranchEntry,
  isHead,
  societyOnBranch,
  type TimelineCardDefinition,
  type TimelineConfig,
  type TimelineState,
} from "@game-maker/engine";

const COL = 148;
const ROW = 136;
const PAD = 24;
const MAT_W = 118;
const NODE_W = 116;
const NODE_H = 88;

export type NodeLayout = {
  id: string;
  x: number;
  y: number;
  lane: number;
};

export type MatLayout = {
  branchId: string;
  x: number;
  y: number;
};

export type TimelineLayout = {
  width: number;
  height: number;
  nodes: Record<string, NodeLayout>;
  mats: Record<string, MatLayout>;
  lanes: Record<string, number>;
};

export function layoutTimeline(state: TimelineState): TimelineLayout {
  const branches = Object.values(state.branches).sort(
    (a, b) => a.index - b.index,
  );
  const lanes: Record<string, number> = {};
  branches.forEach((branch, i) => {
    lanes[branch.id] = i;
  });

  const nodes: Record<string, NodeLayout> = {};
  for (const node of Object.values(state.nodes)) {
    const lane = lanes[node.branchId] ?? 0;
    nodes[node.id] = {
      id: node.id,
      x: PAD + MAT_W + 20 + node.depth * COL,
      y: PAD + lane * ROW,
      lane,
    };
  }

  const mats: Record<string, MatLayout> = {};
  for (const branch of branches) {
    const root = nodes[branch.rootNodeId];
    const lane = lanes[branch.id] ?? 0;
    mats[branch.id] = {
      branchId: branch.id,
      x: root ? Math.max(PAD, root.x - MAT_W - 12) : PAD,
      y: PAD + lane * ROW,
    };
  }

  const maxX = Math.max(
    640,
    ...Object.values(nodes).map((n) => n.x + NODE_W + PAD),
    ...Object.values(mats).map((m) => m.x + MAT_W + PAD),
  );
  const maxY = Math.max(
    320,
    ...Object.values(nodes).map((n) => n.y + NODE_H + PAD),
  );

  return { width: maxX, height: maxY, nodes, mats, lanes };
}

function familyClass(def: TimelineCardDefinition | undefined, isEpoch: boolean) {
  if (isEpoch) return "epoch";
  if (!def) return "rift";
  if (def.family === "event") return def.eventKind ?? "event";
  if (def.family === "society") return def.societyKind ?? "society";
  return def.family;
}

type TimelineCanvasProps = {
  state: TimelineState;
  config: TimelineConfig;
  highlightedNodes: Set<string>;
  highlightedBranches: Set<string>;
  selectedCardInstanceId: string | null;
  onNodeClick: (nodeId: string) => void;
  onMatClick: (branchId: string) => void;
};

export function TimelineCanvas({
  state,
  config,
  highlightedNodes,
  highlightedBranches,
  selectedCardInstanceId,
  onNodeClick,
  onMatClick,
}: TimelineCanvasProps) {
  const layout = layoutTimeline(state);

  return (
    <div className="tl-stream" aria-label="Timestream">
      <div
        className="tl-world"
        style={{ width: layout.width, height: layout.height }}
      >
        <svg
          className="tl-wires"
          width={layout.width}
          height={layout.height}
          aria-hidden="true"
        >
          {Object.values(state.nodes).flatMap((node) =>
            node.parentIds.map((parentId) => {
              const from = layout.nodes[parentId];
              const to = layout.nodes[node.id];
              if (!from || !to) return null;
              const x1 = from.x + NODE_W;
              const y1 = from.y + NODE_H / 2;
              const x2 = to.x;
              const y2 = to.y + NODE_H / 2;
              const mid = (x1 + x2) / 2;
              const merge = node.parentIds.length > 1;
              return (
                <path
                  key={`${parentId}-${node.id}`}
                  d={`M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`}
                  className={
                    merge ? "tl-wire tl-wire-merge" : "tl-wire"
                  }
                />
              );
            }),
          )}
        </svg>

        {Object.values(state.branches).map((branch) => {
          const mat = layout.mats[branch.id];
          if (!mat) return null;
          const society = societyOnBranch(state, config, branch.id);
          const primary = branch.id === state.primaryBranchId;
          return (
            <button
              key={branch.id}
              type="button"
              className={`tl-mat${primary ? " primary" : ""}${
                branch.preserved ? " preserved" : ""
              }${highlightedBranches.has(branch.id) ? " lit" : ""}`}
              style={{ left: mat.x, top: mat.y }}
              onClick={() => onMatClick(branch.id)}
            >
              <span className="tl-mat-index">
                {branch.index}
                {branch.preserved ? " 🔒" : ""}
              </span>
              <strong>{branch.label}</strong>
              <span className="tl-dice">
                <span title="Culture">C {society.culture}</span>
                <span title="Science">S {society.science}</span>
                <span title="Politics">P {society.politics}</span>
                <span title="Crystals">
                  ◆ {primary ? "—" : branch.crystals}
                </span>
              </span>
            </button>
          );
        })}

        {Object.values(state.nodes).map((node) => {
          const pos = layout.nodes[node.id];
          if (!pos) return null;
          const def = node.card
            ? cardById(config, node.card.cardId)
            : undefined;
          const epoch = node.id === state.epochNodeId;
          const here = node.id === state.travelerNodeId;
          const head = isHead(state, node.id);
          const entry = isBranchEntry(state, node.id);
          const kind = familyClass(def, epoch);
          return (
            <button
              key={node.id}
              type="button"
              className={`tl-node ${kind}${here ? " here" : ""}${
                head ? " head" : ""
              }${entry && !epoch ? " entry" : ""}${
                highlightedNodes.has(node.id) ? " lit" : ""
              }`}
              style={{ left: pos.x, top: pos.y }}
              onClick={() => onNodeClick(node.id)}
            >
              {here ? <span className="tl-pawn" aria-hidden="true">◷</span> : null}
              <span className="tl-kicker">
                {epoch
                  ? "Epoch"
                  : head
                    ? "Head"
                    : def?.eventKind ?? def?.family ?? "Rift"}
              </span>
              <span className="tl-title">
                {epoch ? "Origin" : def?.label ?? "Open rift"}
              </span>
            </button>
          );
        })}
      </div>
      {selectedCardInstanceId ? (
        <p className="tl-stream-hint">Card armed — click a node to play it.</p>
      ) : null}
    </div>
  );
}
