import {
  ancestorIds,
  applyAction,
  cardById,
  descendantIds,
  deviceById,
  cardPile,
  isActionCard,
  isPrimary,
  jumperTargets,
  looseTailNodeIds,
  societyOnPath,
  type DeviceId,
  type GameState,
  type TimelineAction,
  type TimelineCardDefinition,
} from "@game-maker/engine";
import { useEffect, useMemo, useState } from "react";
import { cardFaceClass, cardTypeLabel } from "./cardFace";
import {
  idleHint,
  targetingGuide,
  type Targeting,
} from "./targetingGuide";
import { TimelineCanvas } from "./TimelineCanvas";
import "./timeline.css";

type TimelinePlaytestProps = {
  game: GameState;
  onGame: (game: GameState) => void;
  onReset: () => void;
};

function FacedownPile({
  label,
  count,
  variant,
  onDraw,
}: {
  label: string;
  count: number;
  variant: "omega" | "action" | "blueprint";
  onDraw?: () => void;
}) {
  const layers = Math.min(Math.max(count, 1), 30);
  const inner = (
    <>
      <span className="tl-pile-label">{label}</span>
      <span
        className="tl-pile-stack"
        style={{ height: `${5.6 + (layers - 1) * 0.12}rem` }}
      >
        {Array.from({ length: layers }, (_, i) => (
          <span
            key={i}
            className="tl-pile-card"
            style={{
              transform: `translate(${i * 0.7}px, ${-i * 2}px)`,
              zIndex: i,
              opacity: count === 0 ? 0.35 : 1,
            }}
          />
        ))}
      </span>
      <span className="tl-pile-count">{count}</span>
    </>
  );
  if (onDraw) {
    return (
      <button
        type="button"
        className={`tl-pile ${variant}`}
        onClick={onDraw}
        disabled={count === 0}
        aria-label={`Draw from ${label}, ${count} remaining`}
      >
        {inner}
      </button>
    );
  }
  return (
    <div
      className={`tl-pile ${variant}`}
      aria-label={`${label}, ${count} remaining`}
    >
      {inner}
    </div>
  );
}

function UseTokens({
  total,
  remaining,
}: {
  total: number;
  remaining: number;
}) {
  if (total <= 0) return null;
  return (
    <span
      className="tl-tokens"
      aria-label={`${remaining} of ${total} uses remaining`}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={i < remaining ? "tl-token" : "tl-token spent"}
        />
      ))}
    </span>
  );
}

const DEVICE_ORDER: DeviceId[] = [
  "brancher",
  "reverser",
  "relocator",
  "pruner",
  "merger",
  "rewriter",
  "preserver",
  "jumper",
];

export function TimelinePlaytest({
  game,
  onGame,
  onReset,
}: TimelinePlaytestProps) {
  const [targeting, setTargeting] = useState<Targeting>({ kind: "idle" });
  const timeline = game.timeline;
  const config = game.definition.timeline;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setTargeting({ kind: "idle" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const highlighted = useMemo(() => {
    const nodes = new Set<string>();
    const branches = new Set<string>();
    if (!timeline || !config) return { nodes, branches };
    switch (targeting.kind) {
      case "reverser":
        for (const id of ancestorIds(timeline, timeline.travelerNodeId)) {
          nodes.add(id);
        }
        break;
      case "jumper":
        for (const id of jumperTargets(timeline, config)) nodes.add(id);
        break;
      case "relocator-parent": {
        const root = timeline.branches[targeting.branchId]?.rootNodeId;
        const blocked = root
          ? new Set([root, ...descendantIds(timeline, root)])
          : new Set<string>();
        for (const id of Object.keys(timeline.nodes)) {
          if (!blocked.has(id)) nodes.add(id);
        }
        branches.add(targeting.branchId);
        break;
      }
      case "rewriter-card":
        nodes.add(targeting.nodeId);
        break;
      case "brancher-card":
        nodes.add(targeting.fromNodeId);
        break;
      case "play":
      case "brancher":
      case "relocator-branch":
      case "merger-first":
      case "merger-second":
      case "rewriter-node":
      case "preserver":
        for (const id of Object.keys(timeline.nodes)) nodes.add(id);
        break;
      case "pruner":
        for (const id of Object.keys(timeline.nodes)) {
          const here = timeline.nodes[id];
          if (!here) continue;
          if (looseTailNodeIds(timeline, here.branchId).includes(id)) {
            nodes.add(id);
          }
        }
        break;
      default:
        break;
    }
    return { nodes, branches };
  }, [targeting, timeline, config]);

  if (!timeline || !config) {
    return <p>Timeline failed to load.</p>;
  }

  const dispatch = (op: TimelineAction) => {
    onGame(applyAction(game, { type: "timeline", op }));
  };

  const pathSociety = societyOnPath(timeline, config, timeline.travelerNodeId);
  const traveler = timeline.nodes[timeline.travelerNodeId];
  const branch = traveler
    ? timeline.branches[traveler.branchId]
    : undefined;

  const onNodeClick = (nodeId: string) => {
    const node = timeline.nodes[nodeId];
    if (!node) return;
    switch (targeting.kind) {
      case "idle":
        dispatch({ type: "moveTo", nodeId });
        return;
      case "play":
        dispatch({
          type: "playCard",
          instanceId: targeting.instanceId,
          atNodeId: nodeId,
        });
        setTargeting({ kind: "idle" });
        return;
      case "brancher":
        setTargeting({ kind: "brancher-card", fromNodeId: nodeId });
        return;
      case "brancher-card":
        setTargeting({ kind: "brancher-card", fromNodeId: nodeId });
        return;
      case "reverser":
        dispatch({ type: "deviceReverser", toNodeId: nodeId });
        setTargeting({ kind: "idle" });
        return;
      case "relocator-branch":
        if (isPrimary(timeline, node.branchId)) return;
        setTargeting({ kind: "relocator-parent", branchId: node.branchId });
        return;
      case "relocator-parent":
        dispatch({
          type: "deviceRelocator",
          branchId: targeting.branchId,
          newParentNodeId: nodeId,
        });
        setTargeting({ kind: "idle" });
        return;
      case "pruner":
        dispatch({ type: "devicePruner", nodeId });
        setTargeting({ kind: "idle" });
        return;
      case "merger-first":
        setTargeting({ kind: "merger-second", branchId: node.branchId });
        return;
      case "merger-second":
        dispatch({
          type: "deviceMerger",
          fromBranchId: targeting.branchId,
          intoNodeId: nodeId,
        });
        setTargeting({ kind: "idle" });
        return;
      case "rewriter-node":
        if (!node.card) return;
        setTargeting({ kind: "rewriter-card", nodeId });
        return;
      case "rewriter-card":
        if (!node.card) return;
        setTargeting({ kind: "rewriter-card", nodeId });
        return;
      case "preserver":
        dispatch({ type: "devicePreserver", nodeId });
        setTargeting({ kind: "idle" });
        return;
      case "jumper":
        dispatch({ type: "deviceJumper", toNodeId: nodeId });
        setTargeting({ kind: "idle" });
        return;
      default:
        return;
    }
  };

  const onMatClick = (branchId: string) => {
    if (targeting.kind === "idle") {
      dispatch({ type: "takeCrystal", branchId });
      return;
    }
    const root = timeline.branches[branchId]?.rootNodeId;
    if (root) onNodeClick(root);
  };

  const armDevice = (id: DeviceId) => {
    const map: Record<DeviceId, Targeting> = {
      brancher: { kind: "brancher" },
      reverser: { kind: "reverser" },
      relocator: { kind: "relocator-branch" },
      pruner: { kind: "pruner" },
      merger: { kind: "merger-first" },
      rewriter: { kind: "rewriter-node" },
      preserver: { kind: "preserver" },
      jumper: { kind: "jumper" },
    };
    setTargeting(map[id]);
  };

  const cardsByFamily = config.cards.reduce<
    Record<string, TimelineCardDefinition[]>
  >((acc, card) => {
    const key = card.eventKind ?? card.family;
    acc[key] = [...(acc[key] ?? []), card];
    return acc;
  }, {});

  const guide = targetingGuide(targeting);
  const cancelTargeting = () => setTargeting({ kind: "idle" });

  return (
    <div className="tl-play">
      {guide ? (
        <div className="tl-banner targeting" role="status" aria-live="polite">
          {guide.letter ? (
            <span className="tl-banner-letter" aria-hidden="true">
              {guide.letter}
            </span>
          ) : null}
          <div className="tl-banner-copy">
            <strong>
              {guide.title}
              {guide.deviceId ? " in use" : ""}
            </strong>
            {guide.step ? (
              <span className="tl-banner-step">{guide.step}</span>
            ) : null}
            <span>{guide.how}</span>
          </div>
          <button type="button" onClick={cancelTargeting}>
            Cancel · Esc
          </button>
        </div>
      ) : null}
      <section className="tl-toolbar" aria-label="Timeline controls">
        <div className="tl-instructions">
          <p>
            <span className="tl-mode">
              {config.playerCount ?? 1} player
            </span>
            {guide ? `${guide.title} armed.` : idleHint()}
          </p>
          {branch ? (
            <p className="tl-where">
              {branch.label}
              {branch.headNodeId === timeline.travelerNodeId
                ? " · HEAD"
                : ""}
              {" · "}
              C {pathSociety.culture} · S {pathSociety.science} · P{" "}
              {pathSociety.politics}
            </p>
          ) : null}
        </div>
        <div className="tl-toolbar-actions">
          <button
            type="button"
            className={timeline.debugMode ? "active" : ""}
            onClick={() =>
              dispatch({ type: "setDebugMode", enabled: !timeline.debugMode })
            }
          >
            {timeline.debugMode ? "Debug on" : "Debug off"}
          </button>
          <button type="button" onClick={() => dispatch({ type: "stepBack" })}>
            Step back
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: "stepForward" })}
          >
            Step forward
          </button>
          <button type="button" onClick={() => dispatch({ type: "endTurn" })}>
            End turn
          </button>
          {targeting.kind !== "idle" ? (
            <button type="button" onClick={cancelTargeting}>
              Cancel
            </button>
          ) : null}
          <button type="button" className="reset" onClick={onReset}>
            Reset
          </button>
        </div>
      </section>

      {timeline.status === "won" ? (
        <p className="tl-banner win">Three objectives complete. You win.</p>
      ) : null}
      {timeline.status === "endOfTime" ? (
        <div className="tl-banner">
          End of time.
          <button
            type="button"
            onClick={() => dispatch({ type: "endOfTimeStay" })}
          >
            Stay (+1 crystal)
          </button>
          <button
            type="button"
            onClick={() => {
              setTargeting({ kind: "reverser" });
            }}
          >
            Use Reverser
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: "endOfTimeRoll" })}
          >
            Roll a branch mat
          </button>
        </div>
      ) : null}

      <TimelineCanvas
        state={timeline}
        config={config}
        highlightedNodes={highlighted.nodes}
        highlightedBranches={highlighted.branches}
        selectedCardInstanceId={
          targeting.kind === "play" ? targeting.instanceId : null
        }
        onNodeClick={onNodeClick}
        onMatClick={onMatClick}
      />

      <div className="tl-panels">
        <section className="tl-panel tl-player-mat" aria-label="Player mat">
          <h2>Player mat</h2>
          <div className="tl-resources">
            {(["parts", "minerals", "crystals"] as const).map((resource) => (
              <div key={resource} className="tl-resource">
                <span>{resource}</span>
                <strong>{timeline.player[resource]}</strong>
                {timeline.debugMode ? (
                  <span className="tl-stepper">
                    <button
                      type="button"
                      onClick={() =>
                        dispatch({
                          type: "debugSetResource",
                          resource,
                          delta: -1,
                        })
                      }
                    >
                      −
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        dispatch({
                          type: "debugSetResource",
                          resource,
                          delta: 1,
                        })
                      }
                    >
                      +
                    </button>
                  </span>
                ) : null}
              </div>
            ))}
          </div>
          <h3>Device slots</h3>
          <div className="tl-slots">
            {[0, 1, 2].map((i) => {
              const built = timeline.player.devices[i];
              const def = built
                ? deviceById(config, built.deviceId)
                : undefined;
              if (!built || !def) {
                return (
                  <div key={i} className="tl-slot empty">
                    Empty
                  </div>
                );
              }
              const armed = guide?.deviceId === built.deviceId;
              return (
                <button
                  key={i}
                  type="button"
                  className={`tl-slot filled tl-face blueprint${
                    armed ? " armed" : ""
                  }`}
                  aria-pressed={armed}
                  aria-label={`${def.label}, ${built.usesLeft} of ${def.uses} uses remaining`}
                  onClick={() =>
                    armed ? cancelTargeting() : armDevice(built.deviceId)
                  }
                >
                  <span>{def.letter}</span>
                  <strong>{def.label}</strong>
                  <UseTokens total={def.uses} remaining={built.usesLeft} />
                </button>
              );
            })}
          </div>
          <h3>Blueprints</h3>
          {timeline.player.blueprints.length === 0 ? (
            <p className="tl-muted">None filed.</p>
          ) : (
            <div className="tl-filed">
              {timeline.player.blueprints.map((id) => {
                const def = deviceById(config, id);
                return (
                  <div key={id} className="tl-filed-card tl-face blueprint">
                    <span>blueprint</span>
                    <strong>{def?.label ?? id}</strong>
                    <UseTokens
                      total={def?.uses ?? 0}
                      remaining={def?.uses ?? 0}
                    />
                  </div>
                );
              })}
            </div>
          )}
          <h3>Objectives</h3>
          <ul className="tl-objectives">
            {timeline.player.objectives.map((obj) => {
              const person = cardById(config, obj.personId)?.label ?? obj.personId;
              const place = cardById(config, obj.placeId)?.label ?? obj.placeId;
              const thing = cardById(config, obj.thingId)?.label ?? obj.thingId;
              const pending = timeline.player.pendingClaimIds.includes(obj.id);
              return (
                <li key={obj.id}>
                  <span>
                    {person} · {place} · {thing}
                    {obj.complete
                      ? " ✓"
                      : pending
                        ? " (claimed)"
                        : ""}
                  </span>
                  {!obj.complete && !pending ? (
                    <button
                      type="button"
                      onClick={() =>
                        dispatch({ type: "claimObjective", objectiveId: obj.id })
                      }
                    >
                      Claim
                    </button>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        <div className="tl-hand-col">
          <section className="tl-panel" aria-label="Hand">
            <h2>Hand ({timeline.hand.length})</h2>
            <div className="tl-hand">
              {timeline.hand.length === 0 ? (
                <p className="tl-muted">Empty.</p>
              ) : (
                timeline.hand.map((card) => {
                  const def = cardById(config, card.cardId);
                  const device = def?.deviceId
                    ? deviceById(config, def.deviceId)
                    : undefined;
                  const armed =
                    (targeting.kind === "play" &&
                      targeting.instanceId === card.instanceId) ||
                    (targeting.kind === "brancher-card" && isActionCard(def)) ||
                    targeting.kind === "rewriter-card";
                  return (
                    <button
                      key={card.instanceId}
                      type="button"
                      className={`tl-card tl-face ${cardFaceClass(def)}${
                        armed ? " armed" : ""
                      }`}
                      onClick={() => {
                        if (targeting.kind === "brancher-card") {
                          if (!isActionCard(def)) return;
                          dispatch({
                            type: "deviceBrancher",
                            fromNodeId: targeting.fromNodeId,
                            instanceId: card.instanceId,
                          });
                          setTargeting({ kind: "idle" });
                          return;
                        }
                        if (targeting.kind === "rewriter-card") {
                          if (cardPile(def) === "omega") return;
                          dispatch({
                            type: "deviceRewriter",
                            nodeId: targeting.nodeId,
                            instanceId: card.instanceId,
                          });
                          setTargeting({ kind: "idle" });
                          return;
                        }
                        setTargeting({
                          kind: "play",
                          instanceId: card.instanceId,
                        });
                      }}
                    >
                      <span>{cardTypeLabel(def)}</span>
                      <strong>{def?.label ?? card.cardId}</strong>
                      {device ? (
                        <UseTokens total={device.uses} remaining={device.uses} />
                      ) : null}
                    </button>
                  );
                })
              )}
            </div>
            <div className="tl-piles" aria-label="Card piles">
              <FacedownPile
                label="Omega events"
                count={timeline.omegaDeck.length}
                variant="omega"
              />
              <FacedownPile
                label="Actions"
                count={timeline.actionDeck.length}
                variant="action"
                onDraw={() => dispatch({ type: "draw" })}
              />
              <FacedownPile
                label="Blueprints"
                count={timeline.blueprintDeck.length}
                variant="blueprint"
              />
            </div>
          </section>

          <section className="tl-panel" aria-label="Devices">
            <h2>Devices</h2>
            <div className="tl-dock">
              {DEVICE_ORDER.map((id) => {
                const def = deviceById(config, id);
                if (!def) return null;
                const req = def.requirements;
                return (
                  <button
                    key={id}
                    type="button"
                    className={`tl-device${
                      guide?.deviceId === id ? " armed" : ""
                    }`}
                    aria-pressed={guide?.deviceId === id}
                    onClick={() =>
                      guide?.deviceId === id ? cancelTargeting() : armDevice(id)
                    }
                  >
                    <span className="tl-letter">{def.letter}</span>
                    <span>
                      <strong>{def.label}</strong>
                      <em>{def.summary}</em>
                      <small>
                        {req.parts}p {req.minerals}m {req.crystals}◆ to run · C
                        {req.culture} S{req.science} P{req.politics}
                      </small>
                      <UseTokens total={def.uses} remaining={def.uses} />
                    </span>
                  </button>
                );
              })}
            </div>
            {timeline.debugMode ? (
              <div className="tl-build">
                {DEVICE_ORDER.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() =>
                      dispatch({ type: "debugBuildDevice", deviceId: id })
                    }
                  >
                    Slot {deviceById(config, id)?.letter}
                  </button>
                ))}
              </div>
            ) : null}
          </section>
        </div>
      </div>

      {timeline.debugMode ? (
        <section className="tl-panel tl-debug" aria-label="Debug catalog">
          <h2>Debug catalog</h2>
          <p className="tl-muted">Add any card to hand.</p>
          {Object.entries(cardsByFamily).map(([family, cards]) => (
            <div key={family} className="tl-catalog-row">
              <span>{family}</span>
              <div>
                {cards.map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() =>
                      dispatch({ type: "debugAddCard", cardId: card.id })
                    }
                  >
                    {card.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>
      ) : null}

      <ol className="tl-log" aria-label="Event log">
        {[...timeline.log].reverse().map((line, i) => (
          <li key={`${i}-${line}`}>{line}</li>
        ))}
      </ol>
    </div>
  );
}
