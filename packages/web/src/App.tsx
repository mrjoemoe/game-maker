import {
  isTileFlipEnabled,
  pieceAt,
  type Coord,
} from "@game-maker/engine";
import { BoardView } from "./components/BoardView";
import { resolvePrototype } from "./prototypes/registry";
import { cellClicked, useGameSession, type InteractionMode } from "./store/gameSession";
import "./app.css";

const prototypeId = import.meta.env.VITE_PROTOTYPE as string | undefined;
const active = resolvePrototype(prototypeId);

export function App() {
  const [state, dispatch] = useGameSession(active.definition);
  const flipEnabled = isTileFlipEnabled(state.game.definition);

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
        <button
          type="button"
          className="reset"
          onClick={() => dispatch({ type: "game", action: { type: "reset" } })}
        >
          Reset
        </button>
      </section>

      <main className="stage">
        <BoardView
          game={state.game}
          selectedPieceId={state.selectedPieceId}
          onCellClick={onCellClick}
        />
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
      </main>
    </div>
  );
}
