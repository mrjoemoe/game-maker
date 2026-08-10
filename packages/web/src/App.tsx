import {
  isRunModeEnabled,
  isTileFlipEnabled,
  pieceAt,
  type Coord,
} from "@game-maker/engine";
import { useEffect } from "react";
import { BoardView } from "./components/BoardView";
import { RunHud } from "./components/RunHud";
import { resolvePrototype } from "./prototypes/registry";
import {
  cellClicked,
  useGameSession,
  type InteractionMode,
} from "./store/gameSession";
import "./app.css";

const prototypeId = import.meta.env.VITE_PROTOTYPE as string | undefined;
const active = resolvePrototype(prototypeId);

export function App() {
  const [state, dispatch] = useGameSession(active.definition);
  const flipEnabled = isTileFlipEnabled(state.game.definition);
  const runMode = isRunModeEnabled(state.game.definition);
  const heroId = state.game.definition.run?.heroPieceId;

  const onCellClick = (coord: Coord) => {
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

  useEffect(() => {
    if (!runMode || !heroId) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (state.game.run.status !== "playing") {
        return;
      }
      const hero = state.game.pieces.find((p) => p.id === heroId);
      if (!hero) {
        return;
      }
      const deltas: Record<string, Coord> = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 },
        s: { x: 0, y: 1 },
        a: { x: -1, y: 0 },
        d: { x: 1, y: 0 },
      };
      const delta = deltas[event.key];
      if (!delta) {
        return;
      }
      event.preventDefault();
      dispatch({
        type: "game",
        action: {
          type: "step",
          pieceId: heroId,
          destination: {
            x: hero.position.x + delta.x,
            y: hero.position.y + delta.y,
          },
        },
      });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [runMode, heroId, state.game, dispatch]);

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
            <span className="mode-label">Step through the woods</span>
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
        <button
          type="button"
          className="reset"
          onClick={() => dispatch({ type: "game", action: { type: "reset" } })}
        >
          {runMode ? "New map" : "Reset"}
        </button>
      </section>

      {runMode ? (
        <RunHud
          game={state.game}
          onSoftReset={() =>
            dispatch({ type: "game", action: { type: "softReset" } })
          }
        />
      ) : null}

      <main className="stage">
        <BoardView
          game={state.game}
          selectedPieceId={state.selectedPieceId}
          onCellClick={onCellClick}
        />
        <aside className="hint">
          {active.extensions.banner ? <p>{active.extensions.banner}</p> : null}
          {runMode ? (
            <>
              <p>
                Click an adjacent tile (or use arrow keys / WASD) to step. Tiles
                reveal as you enter them.
              </p>
              <p>
                Die, learn the map, try again — found gear carries over.
              </p>
            </>
          ) : (
            <>
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
            </>
          )}
        </aside>
      </main>
    </div>
  );
}
