import {
  cardById,
  isBranchEntry,
  isHead,
  isPreservedNode,
  societyOnBranch,
  societyOnPath,
  type TimelineConfig,
  type TimelineState,
} from "@game-maker/engine";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cardFaceClass, cardTypeLabel } from "./cardFace";
import { layoutTimeline, MAX_TRACK_ROWS, MAT_H, NODE_H, NODE_W } from "./layout";
import { planWires } from "./wires";

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
  const streamRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const layout = layoutTimeline(state, viewportWidth);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useLayoutEffect(() => {
    const el = streamRef.current;
    if (!el) return;
    const sync = () => setViewportWidth(el.clientWidth);
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = streamRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [layout.height]);

  useLayoutEffect(() => {
    const el = streamRef.current;
    const epoch = layout.nodes[state.epochNodeId];
    if (!el || !epoch) return;
    el.scrollLeft = Math.max(0, epoch.x + NODE_W / 2 - el.clientWidth / 2);
  }, [layout.width, state.epochNodeId, viewportWidth]);
  const hovered = hoveredId ? state.nodes[hoveredId] : null;
  const hoverSociety = hovered
    ? societyOnPath(state, config, hovered.id)
    : null;
  const hoverPos = hoveredId ? layout.nodes[hoveredId] : null;
  const wires = planWires(state, layout);

  return (
    <div className="tl-stream" aria-label="Timestream" ref={streamRef}>
      <div
        className="tl-world"
        style={{ width: layout.width, height: layout.height }}
      >
        {Object.values(state.branches).map((branch) => {
          const throughId = branch.preservedThroughNodeId;
          if (!throughId) return null;
          const mat = layout.mats[branch.id];
          const through = layout.nodes[throughId];
          if (!mat || !through) return null;
          const top = through.y - 8;
          const bottom = mat.y + MAT_H + 8;
          return (
            <div
              key={`lock-${branch.id}`}
              className="tl-lock"
              style={{
                left: mat.x - 8,
                width: NODE_W + 16,
                top,
                height: Math.max(bottom - top, NODE_H),
              }}
              aria-hidden="true"
            />
          );
        })}

        <svg
          className="tl-wires"
          width={layout.width}
          height={layout.height}
          aria-hidden="true"
        >
          {layout.rows.map((row) => (
            <g key={row.row}>
              <line
                className="tl-grid"
                x1={32}
                y1={row.y + NODE_H / 2}
                x2={layout.width - 8}
                y2={row.y + NODE_H / 2}
              />
            </g>
          ))}
          {wires.flatMap((wire) =>
            wire.parts.map((d, i) => (
              <path
                key={`${wire.key}-halo-${i}`}
                d={d}
                className={`tl-wire-halo ${wire.kind}`}
              />
            )),
          )}
          {wires.flatMap((wire) =>
            wire.parts.map((d, i) => (
              <path
                key={`${wire.key}-${i}`}
                d={d}
                className={`tl-wire ${wire.kind}`}
              />
            )),
          )}
          {wires.flatMap((wire) =>
            wire.labels.map((label, i) => (
              <g
                key={`${wire.key}-j${i}`}
                className={`tl-jump ${wire.kind}`}
              >
                <circle cx={label.x} cy={label.y} r={10} />
                <text x={label.x} y={label.y}>
                  {label.letter}
                </text>
              </g>
            )),
          )}
        </svg>

        {layout.rows.map((row) => (
          <span
            key={row.row}
            className={`tl-row-num${row.row === MAX_TRACK_ROWS ? " cap" : ""}`}
            style={{ top: row.y + 10 }}
          >
            {row.row}
          </span>
        ))}

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
                branch.preservedThroughNodeId ? " preserved" : ""
              }${highlightedBranches.has(branch.id) ? " lit" : ""}`}
              style={{ left: mat.x, top: mat.y }}
              onClick={() => onMatClick(branch.id)}
            >
              <span className="tl-mat-index">
                {branch.index}
                {branch.preservedThroughNodeId ? " 🔒" : ""}
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
          const ended =
            Boolean(state.branches[node.branchId]?.mergedIntoNodeId) &&
            node.id === state.branches[node.branchId]?.headNodeId;
          const locked = isPreservedNode(state, node.id);
          const kind = cardFaceClass(def, epoch);
          const rowLabel = epoch ? "E" : String(node.depth);
          return (
            <button
              key={node.id}
              type="button"
              className={`tl-node tl-face ${kind}${here ? " here" : ""}${
                head ? " head" : ""
              }${ended ? " merged" : ""}${locked ? " locked" : ""}${
                entry && !epoch ? " entry" : ""
              }${highlightedNodes.has(node.id) ? " lit" : ""}`}
              style={{ left: pos.x, top: pos.y }}
              onClick={() => onNodeClick(node.id)}
              onMouseEnter={() => setHoveredId(node.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {here ? (
                <span className="tl-pawn" aria-hidden="true">
                  ◷
                </span>
              ) : null}
              <span className="tl-row-chip">{rowLabel}</span>
              <span className="tl-kicker">
                {epoch ? "Epoch" : cardTypeLabel(def)}
                {ended ? " · merged" : locked ? " · locked" : head && !epoch ? " · head" : ""}
              </span>
              <span className="tl-title">
                {epoch ? "Origin" : def?.label ?? "Confluence"}
              </span>
            </button>
          );
        })}

        {hovered && hoverSociety && hoverPos ? (
          <div
            className="tl-tip"
            style={{ left: hoverPos.x + NODE_W + 8, top: hoverPos.y }}
            role="status"
          >
            <strong>
              {hovered.card
                ? "At this moment"
                : hovered.id === state.epochNodeId
                  ? "Epoch"
                  : "Confluence"}
            </strong>
            <span>Culture {hoverSociety.culture}</span>
            <span>Science {hoverSociety.science}</span>
            <span>Politics {hoverSociety.politics}</span>
          </div>
        ) : null}
      </div>
      {selectedCardInstanceId ? (
        <p className="tl-stream-hint">Card armed — click a node to play it.</p>
      ) : null}
    </div>
  );
}
