import {
  applyAction,
  isRunModeEnabled,
  isTileFlipEnabled,
  pieceAt,
  runProgramLength,
  type Coord,
  type ProgramStep,
} from "@game-maker/engine";
import { useCallback, useRef, useState } from "react";
import { ActionBank } from "./components/ActionBank";
import { ActionTrack } from "./components/ActionTrack";
import { BoardView } from "./components/BoardView";
import { InventoryPanel } from "./components/InventoryPanel";
import { RulebookPanel } from "./components/RulebookPanel";
import { RunHud } from "./components/RunHud";
import { TileTally } from "./components/TileTally";
import { resolvePrototype } from "./prototypes/registry";
import {
  cellClicked,
  useGameSession,
  type InteractionMode,
} from "./store/gameSession";
import "./app.css";

const prototypeId = import.meta.env.VITE_PROTOTYPE as string | undefined;
const active = resolvePrototype(prototypeId);
const STEP_MS = 420;

type AppTab = "play" | "rulebook";

export function App() {
  const [state, dispatch] = useGameSession(active.definition);
  const flipEnabled = isTileFlipEnabled(state.game.definition);
  const runMode = isRunModeEnabled(state.game.definition);
  const heroId = state.game.definition.run?.heroPieceId;
  const programLength = runProgramLength(state.game.definition);
  const rulebook = active.extensions.rulebook;
  const [tab, setTab] = useState<AppTab>("play");

  const [path, setPath] = useState<ProgramStep[]>([]);
  const [executingIndex, setExecutingIndex] = useState<number | null>(null);
  const [selectedLoadout, setSelectedLoadout] = useState<string[]>([]);
  const executingRef = useRef(false);
  const cancelRef = useRef(false);
  const gameRef = useRef(state.game);
  gameRef.current = state.game;

  const clearPath = useCallback(() => {
    setPath([]);
    setExecutingIndex(null);
  }, []);

  const onCellClick = (coord: Coord) => {
    if (runMode) {
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
  const showRulebookTab = Boolean(rulebook);

  return (
    <div className="app">
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
          <button
            type="button"
            className={tab === "play" ? "app-tab active" : "app-tab"}
            onClick={() => setTab("play")}
          >
            Play
          </button>
          <button
            type="button"
            className={tab === "rulebook" ? "app-tab active" : "app-tab"}
            onClick={() => setTab("rulebook")}
          >
            Rulebook
          </button>
        </nav>
      ) : null}

      {tab === "rulebook" && rulebook ? (
        <RulebookPanel markdown={rulebook} />
      ) : (
        <>
          <section className="toolbar" aria-label="Playtest controls">
            {runMode ? (
              <div className="modes">
                <span className="mode-label">
                  Program up to {programLength} actions, then run
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
              <>
                <div className="board-column">
                  <BoardView
                    game={state.game}
                    selectedPieceId={state.selectedPieceId}
                    onCellClick={onCellClick}
                  />
                  <ActionTrack
                    programLength={programLength}
                    steps={path}
                    items={allItems}
                    executingIndex={executingIndex}
                    disabled={state.game.run.status !== "playing"}
                    onUndo={() => setPath((prev) => prev.slice(0, -1))}
                    onClear={clearPath}
                    onExecute={() => {
                      void runProgramAnimated();
                    }}
                  />
                  <InventoryPanel
                    game={state.game}
                    selectedLoadout={selectedLoadout}
                    onToggleLoadout={toggleLoadout}
                    onCommitLoadout={commitLoadout}
                  />
                </div>
                <div className="run-sidebar">
                  <ActionBank
                    programLength={programLength}
                    steps={path}
                    items={allItems}
                    inventory={state.game.run.inventory}
                    coins={state.game.coins}
                    disabled={state.game.run.status !== "playing"}
                    executing={executingIndex !== null}
                    onAppend={(step) =>
                      setPath((prev) =>
                        prev.length >= programLength ? prev : [...prev, step],
                      )
                    }
                  />
                  <TileTally game={state.game} />
                </div>
              </>
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
