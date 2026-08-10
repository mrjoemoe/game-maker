import {
  applyAction,
  destinationFrom,
  isInBounds,
  isRunModeEnabled,
  isTileFlipEnabled,
  pieceAt,
  runProgramLength,
  type Coord,
  type Direction,
} from "@game-maker/engine";
import { useCallback, useEffect, useRef, useState } from "react";
import { BoardView } from "./components/BoardView";
import { InventoryPanel } from "./components/InventoryPanel";
import { MagePicker } from "./components/MagePicker";
import { PathPlanner } from "./components/PathPlanner";
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

export function App() {
  const [state, dispatch] = useGameSession(active.definition);
  const flipEnabled = isTileFlipEnabled(state.game.definition);
  const runMode = isRunModeEnabled(state.game.definition);
  const heroId = state.game.definition.run?.heroPieceId;
  const programLength = runProgramLength(state.game.definition);
  const awaitingItemChoice = Boolean(state.game.run.pendingItemChoice);

  const [path, setPath] = useState<Direction[]>([]);
  const [executingIndex, setExecutingIndex] = useState<number | null>(null);
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
    dispatch({ type: "game", action: { type: "softReset" } });
  };

  const hardReset = () => {
    cancelRef.current = true;
    executingRef.current = false;
    clearPath();
    dispatch({ type: "game", action: { type: "reset" } });
  };

  const chooseItem = (itemId: string) => {
    dispatch({ type: "game", action: { type: "chooseItem", itemId } });
    clearPath();
  };

  const runProgramAnimated = useCallback(async () => {
    if (!heroId || executingRef.current || path.length !== programLength) {
      return;
    }
    if (
      gameRef.current.run.status !== "playing" ||
      gameRef.current.run.pendingItemChoice
    ) {
      return;
    }

    const steps = [...path];
    executingRef.current = true;
    cancelRef.current = false;
    let local = gameRef.current;

    for (let i = 0; i < steps.length; i += 1) {
      if (
        cancelRef.current ||
        local.run.status !== "playing" ||
        local.run.pendingItemChoice
      ) {
        break;
      }
      const hero = local.pieces.find((p) => p.id === heroId);
      if (!hero) {
        break;
      }
      setExecutingIndex(i);
      const destination = destinationFrom(hero.position, steps[i]);
      if (isInBounds(local.board.grid, destination)) {
        try {
          local = applyAction(local, {
            type: "step",
            pieceId: heroId,
            destination,
          });
          dispatch({ type: "replaceGame", game: local });
          gameRef.current = local;
        } catch {
          // Ignore invalid step and continue the program.
        }
      }
      if (local.run.pendingItemChoice) {
        break;
      }
      await new Promise((r) => setTimeout(r, STEP_MS));
    }

    executingRef.current = false;
    setExecutingIndex(null);
    setPath([]);
  }, [heroId, path, programLength, dispatch]);

  useEffect(() => {
    if (!runMode) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        executingRef.current ||
        state.game.run.status !== "playing" ||
        state.game.run.pendingItemChoice
      ) {
        return;
      }
      const map: Record<string, Direction> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
        w: "up",
        s: "down",
        a: "left",
        d: "right",
      };
      if (event.key === "Backspace") {
        event.preventDefault();
        setPath((prev) => prev.slice(0, -1));
        return;
      }
      if (event.key === "Enter" && path.length === programLength) {
        event.preventDefault();
        void runProgramAnimated();
        return;
      }
      const direction = map[event.key];
      if (!direction) {
        return;
      }
      event.preventDefault();
      setPath((prev) =>
        prev.length >= programLength ? prev : [...prev, direction],
      );
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    runMode,
    path.length,
    programLength,
    state.game.run.status,
    state.game.run.pendingItemChoice,
    runProgramAnimated,
  ]);

  const allItems = Object.values(state.game.items);

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

      <section className="toolbar" aria-label="Playtest controls">
        {runMode ? (
          <div className="modes">
            <span className="mode-label">
              Program {programLength} moves, then run
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
        <BoardView
          game={state.game}
          selectedPieceId={state.selectedPieceId}
          onCellClick={onCellClick}
        />
        {runMode ? (
          <div className="run-sidebar">
            <PathPlanner
              programLength={programLength}
              steps={path}
              executingIndex={executingIndex}
              disabled={
                state.game.run.status !== "playing" || awaitingItemChoice
              }
              onAppend={(direction) =>
                setPath((prev) =>
                  prev.length >= programLength ? prev : [...prev, direction],
                )
              }
              onUndo={() => setPath((prev) => prev.slice(0, -1))}
              onClear={clearPath}
              onExecute={() => {
                void runProgramAnimated();
              }}
            />
            <InventoryPanel game={state.game} />
            <TileTally game={state.game} />
          </div>
        ) : (
          <aside className="hint">
            {active.extensions.banner ? <p>{active.extensions.banner}</p> : null}
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
        )}
      </main>

      {runMode && active.extensions.banner ? (
        <p className="run-banner-note">{active.extensions.banner}</p>
      ) : null}

      {runMode && awaitingItemChoice ? (
        <MagePicker items={allItems} onChoose={chooseItem} />
      ) : null}
    </div>
  );
}
