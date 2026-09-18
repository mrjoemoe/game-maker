import {
  applyAction,
  destinationFrom,
  isRunModeEnabled,
  isTileFlipEnabled,
  isTimelineModeEnabled,
  pieceAt,
  runProgramLength,
  type Coord,
  type Direction,
  type ProgramStep,
} from "@game-maker/engine";
import { useCallback, useRef, useState } from "react";
import { ActionsPanel } from "./components/ActionsPanel";
import { BoardView } from "./components/BoardView";
import { DebugPanel } from "./components/DebugPanel";
import { InventoryPanel } from "./components/InventoryPanel";
import { RulebookPanel } from "./components/RulebookPanel";
import { RunHud } from "./components/RunHud";
import { TimelinePlaytest } from "./components/timeline/TimelinePlaytest";
import { TileTally } from "./components/TileTally";
import { resolvePrototype } from "./prototypes/registry";
import {
  cellClicked,
  useGameSession,
  type InteractionMode,
} from "./store/gameSession";
import { describeInspectedCell } from "./store/inspectCell";
import { pathForTab } from "./store/playtestRoute";
import { canQueueWalk, walkMovesToQueue } from "./store/queueWalk";
import { sameDocumentNav, usePlaytestTab } from "./store/usePlaytestTab";
import "./app.css";

const prototypeId = import.meta.env.VITE_PROTOTYPE as string | undefined;
const active = resolvePrototype(prototypeId);
const STEP_MS = 420;

export function App() {
  const [state, dispatch] = useGameSession(active.definition);
  const flipEnabled = isTileFlipEnabled(state.game.definition);
  const runMode = isRunModeEnabled(state.game.definition);
  const timelineMode = isTimelineModeEnabled(state.game.definition);
  const heroId = state.game.definition.run?.heroPieceId;
  const programLength = runProgramLength(state.game.definition);
  const rulebook = active.extensions.rulebook;
  const showRulebookTab = Boolean(rulebook);
  const [tab, setTab] = usePlaytestTab(showRulebookTab);

  const [path, setPath] = useState<ProgramStep[]>([]);
  const [executingIndex, setExecutingIndex] = useState<number | null>(null);
  const [selectedLoadout, setSelectedLoadout] = useState<string[]>([]);
  const [debugRevealAll, setDebugRevealAll] = useState(false);
  const [debugEnabled, setDebugEnabled] = useState(false);
  const [debugCoords, setDebugCoords] = useState(false);
  const [debugWalkNow, setDebugWalkNow] = useState(false);
  const [debugTeleport, setDebugTeleport] = useState(false);
  const [inspected, setInspected] = useState<Coord | null>(null);
  const [heroFacing, setHeroFacing] = useState<Direction>("down");
  const executingRef = useRef(false);
  const cancelRef = useRef(false);
  const gameRef = useRef(state.game);
  gameRef.current = state.game;

  const clearPath = useCallback(() => {
    setPath([]);
    setExecutingIndex(null);
  }, []);

  const applyDebugWalk = (coord: Coord) => {
    if (!heroId) return;
    const extra = walkMovesToQueue(gameRef.current, [], coord, 99);
    if (extra.length === 0) return;
    let local = gameRef.current;
    for (const step of extra) {
      if (step.kind !== "move") break;
      const piece = local.pieces.find((p) => p.id === heroId);
      if (!piece) break;
      const destination = destinationFrom(piece.position, step.direction);
      try {
        local = applyAction(local, {
          type: "step",
          pieceId: heroId,
          destination,
        });
        setHeroFacing(step.direction);
      } catch {
        break;
      }
      if (local.run.status !== "playing") break;
    }
    dispatch({ type: "replaceGame", game: local });
    gameRef.current = local;
  };

  const onCellClick = (coord: Coord) => {
    if (runMode) {
      setInspected(coord);
      if (debugEnabled && debugTeleport && heroId) {
        dispatch({
          type: "game",
          action: { type: "movePiece", pieceId: heroId, destination: coord },
        });
        return;
      }
      if (debugEnabled && debugWalkNow) {
        applyDebugWalk(coord);
        return;
      }
      const remaining = programLength - path.length;
      if (
        !canQueueWalk(
          path,
          remaining,
          executingIndex !== null,
          state.game.run.status === "playing",
        )
      ) {
        return;
      }
      const extra = walkMovesToQueue(state.game, path, coord, remaining);
      if (extra.length === 0) {
        return;
      }
      const last = extra[extra.length - 1];
      if (last?.kind === "move") {
        setHeroFacing(last.direction);
      }
      setPath((prev) => [...prev, ...extra]);
      return;
    }
    const piece = pieceAt(state.game.pieces, coord);
    for (const action of cellClicked(state, coord, piece?.id)) {
      dispatch(action);
    }
  };

  const setMode = (mode: InteractionMode) => {
    if (mode === "flip" && !flipEnabled) {
      return;
    }
    dispatch({ type: "setMode", mode });
  };

  const softReset = () => {
    cancelRef.current = true;
    executingRef.current = false;
    clearPath();
    setSelectedLoadout([]);
    dispatch({ type: "game", action: { type: "softReset" } });
  };

  const hardReset = () => {
    cancelRef.current = true;
    executingRef.current = false;
    clearPath();
    setSelectedLoadout([]);
    setDebugRevealAll(false);
    setDebugEnabled(false);
    setDebugCoords(false);
    setDebugWalkNow(false);
    setDebugTeleport(false);
    setInspected(null);
    setHeroFacing("down");
    dispatch({ type: "game", action: { type: "reset" } });
  };

  const toggleLoadout = (itemId: string) => {
    setSelectedLoadout((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const commitLoadout = () => {
    dispatch({
      type: "game",
      action: { type: "commitLoadout", itemIds: selectedLoadout },
    });
    setSelectedLoadout([]);
  };

  const runProgramAnimated = useCallback(async () => {
    if (!heroId || executingRef.current || path.length < 1) {
      return;
    }
    if (path.length > programLength) {
      return;
    }
    if (gameRef.current.run.status !== "playing") {
      return;
    }

    const steps = [...path];
    executingRef.current = true;
    cancelRef.current = false;
    let local = gameRef.current;

    for (let i = 0; i < steps.length; i += 1) {
      if (cancelRef.current || local.run.status !== "playing") {
        break;
      }
      setExecutingIndex(i);
      try {
        local = applyAction(local, {
          type: "programStep",
          pieceId: heroId,
          step: steps[i],
        });
        dispatch({ type: "replaceGame", game: local });
        gameRef.current = local;
      } catch {
        break;
      }
      await new Promise((r) => setTimeout(r, STEP_MS));
    }

    // Animated programStep skips applyRunProgram's end-of-program flush.
    if (local.run.status === "playing" && local.run.pendingUseItemId) {
      local = {
        ...local,
        run: {
          ...local.run,
          status: "lost",
          bump: "You used an item but didn't move — path over",
          pendingUseItemId: null,
        },
      };
      dispatch({ type: "replaceGame", game: local });
      gameRef.current = local;
    }

    executingRef.current = false;
    setExecutingIndex(null);
    setPath([]);
  }, [heroId, path, programLength, dispatch]);

  const allItems = Object.values(state.game.items);

  return (
    <div className={timelineMode ? "app app-timeline" : "app"}>
      <header className="hero">
        <p className="brand">Game Maker</p>
        <h1>{state.game.definition.name}</h1>
        <p className="lede">
          Prototype <code>{state.game.definition.id}</code> on template{" "}
          <code>{state.game.definition.templateId}</code>.
        </p>
      </header>

      {showRulebookTab ? (
        <nav className="app-tabs" aria-label="Playtest views">
          <a
            href={pathForTab("play")}
            className={tab === "play" ? "app-tab active" : "app-tab"}
            aria-current={tab === "play" ? "page" : undefined}
            onClick={(event) => {
              if (!sameDocumentNav(event)) return;
              event.preventDefault();
              setTab("play");
            }}
          >
            Play
          </a>
          <a
            href={pathForTab("rulebook")}
            className={tab === "rulebook" ? "app-tab active" : "app-tab"}
            aria-current={tab === "rulebook" ? "page" : undefined}
            onClick={(event) => {
              if (!sameDocumentNav(event)) return;
              event.preventDefault();
              setTab("rulebook");
            }}
          >
            Rulebook
          </a>
        </nav>
      ) : null}

      {tab === "rulebook" && rulebook ? (
        <RulebookPanel markdown={rulebook} />
      ) : timelineMode ? (
        <TimelinePlaytest
          game={state.game}
          onGame={(next) => dispatch({ type: "replaceGame", game: next })}
          onReset={hardReset}
        />
      ) : (
        <>
          <section className="toolbar" aria-label="Playtest controls">
            {runMode ? (
              <div className="modes">
                <span className="mode-label">
                  Click a tile to queue a walk, or pick actions above — up to{" "}
                  {programLength}, then run
                </span>
              </div>
            ) : (
              <div className="modes">
                <button
                  type="button"
                  className={state.mode === "move" ? "active" : ""}
                  onClick={() => setMode("move")}
                >
                  Move pieces
                </button>
                {flipEnabled ? (
                  <button
                    type="button"
                    className={state.mode === "flip" ? "active" : ""}
                    onClick={() => setMode("flip")}
                  >
                    Flip tiles
                  </button>
                ) : null}
              </div>
            )}
            <button type="button" className="reset" onClick={hardReset}>
              {runMode ? "New map" : "Reset"}
            </button>
          </section>

          {runMode ? (
            <RunHud game={state.game} onSoftReset={softReset} />
          ) : null}

          <main className={`stage${runMode ? " stage-run" : ""}`}>
            {runMode ? (
              <div className="board-column">
                <ActionsPanel
                  programLength={programLength}
                  steps={path}
                  items={allItems}
                  inventory={state.game.run.inventory}
                  coins={state.game.coins}
                  executingIndex={executingIndex}
                  disabled={state.game.run.status !== "playing"}
                  onAppend={(step) =>
                    setPath((prev) =>
                      prev.length >= programLength ? prev : [...prev, step],
                    )
                  }
                  onUndo={() => setPath((prev) => prev.slice(0, -1))}
                  onClear={clearPath}
                  onExecute={() => {
                    void runProgramAnimated();
                  }}
                />
                <BoardView
                  game={state.game}
                  selectedPieceId={state.selectedPieceId}
                  onCellClick={onCellClick}
                  forceRevealAll={debugRevealAll}
                  heroFacing={heroFacing}
                  showCoords={debugEnabled && debugCoords}
                />
                <InventoryPanel
                  game={state.game}
                  selectedLoadout={selectedLoadout}
                  onToggleLoadout={toggleLoadout}
                  onCommitLoadout={commitLoadout}
                />
                <TileTally game={state.game} />
                <DebugPanel
                  enabled={debugEnabled}
                  revealAll={debugRevealAll}
                  showCoords={debugCoords}
                  walkNow={debugWalkNow}
                  teleport={debugTeleport}
                  inspectorText={describeInspectedCell(state.game, inspected)}
                  onToggleEnabled={() =>
                    setDebugEnabled((prev) => {
                      if (prev) {
                        setDebugWalkNow(false);
                        setDebugTeleport(false);
                        setDebugCoords(false);
                      }
                      return !prev;
                    })
                  }
                  onToggleRevealAll={() =>
                    setDebugRevealAll((prev) => !prev)
                  }
                  onToggleCoords={() => setDebugCoords((prev) => !prev)}
                  onToggleWalkNow={() =>
                    setDebugWalkNow((prev) => {
                      const next = !prev;
                      if (next) setDebugTeleport(false);
                      return next;
                    })
                  }
                  onToggleTeleport={() =>
                    setDebugTeleport((prev) => {
                      const next = !prev;
                      if (next) setDebugWalkNow(false);
                      return next;
                    })
                  }
                />
              </div>
            ) : (
              <>
                <BoardView
                  game={state.game}
                  selectedPieceId={state.selectedPieceId}
                  onCellClick={onCellClick}
                />
                <aside className="hint">
                  {active.extensions.banner ? (
                    <p>{active.extensions.banner}</p>
                  ) : null}
                  <p>
                    Mode:{" "}
                    <strong>
                      {state.mode === "flip" && flipEnabled ? "Flip" : "Move"}
                    </strong>
                  </p>
                  <p>
                    {state.mode === "flip" && flipEnabled
                      ? "Click any cell to flip its tile face up or face down."
                      : "Click a piece, then click a destination cell."}
                  </p>
                  {state.selectedPieceId ? (
                    <p>Selected: {state.selectedPieceId}</p>
                  ) : null}
                </aside>
              </>
            )}
          </main>

          {runMode && active.extensions.banner ? (
            <p className="run-banner-note">{active.extensions.banner}</p>
          ) : null}
        </>
      )}
    </div>
  );
}
