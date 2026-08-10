import {
  DIRECTIONS,
  directionLabel,
  type Direction,
} from "@game-maker/engine";

type PathPlannerProps = {
  programLength: number;
  steps: Direction[];
  executingIndex: number | null;
  disabled: boolean;
  onAppend: (direction: Direction) => void;
  onUndo: () => void;
  onClear: () => void;
  onExecute: () => void;
};

export function PathPlanner({
  programLength,
  steps,
  executingIndex,
  disabled,
  onAppend,
  onUndo,
  onClear,
  onExecute,
}: PathPlannerProps) {
  const full = steps.length >= programLength;
  const canExecute = steps.length === programLength && !disabled && executingIndex === null;

  return (
    <aside className="path-planner" aria-label="Path planner">
      <h2>Chart path</h2>
      <p className="path-lede">
        Lock in {programLength} moves, then run them. Plan carefully — you
        commit before the tiles resolve.
      </p>

      <ol className="path-slots">
        {Array.from({ length: programLength }, (_, i) => {
          const step = steps[i];
          const active = executingIndex === i;
          return (
            <li
              key={i}
              className={`path-slot${step ? " filled" : ""}${active ? " active" : ""}`}
            >
              <span className="slot-index">{i + 1}</span>
              <span className="slot-dir">{step ? directionLabel(step) : "—"}</span>
            </li>
          );
        })}
      </ol>

      <div className="path-pad" role="group" aria-label="Add move">
        <button
          type="button"
          className="pad-btn pad-up"
          disabled={disabled || full || executingIndex !== null}
          onClick={() => onAppend("up")}
          aria-label="Up"
        >
          ↑
        </button>
        <div className="pad-row">
          <button
            type="button"
            className="pad-btn"
            disabled={disabled || full || executingIndex !== null}
            onClick={() => onAppend("left")}
            aria-label="Left"
          >
            ←
          </button>
          <button
            type="button"
            className="pad-btn"
            disabled={disabled || full || executingIndex !== null}
            onClick={() => onAppend("down")}
            aria-label="Down"
          >
            ↓
          </button>
          <button
            type="button"
            className="pad-btn"
            disabled={disabled || full || executingIndex !== null}
            onClick={() => onAppend("right")}
            aria-label="Right"
          >
            →
          </button>
        </div>
      </div>

      <div className="path-actions">
        <button
          type="button"
          disabled={disabled || steps.length === 0 || executingIndex !== null}
          onClick={onUndo}
        >
          Undo
        </button>
        <button
          type="button"
          disabled={disabled || steps.length === 0 || executingIndex !== null}
          onClick={onClear}
        >
          Clear
        </button>
        <button
          type="button"
          className="path-go"
          disabled={!canExecute}
          onClick={onExecute}
        >
          Run path
        </button>
      </div>

      <p className="path-hint">
        {DIRECTIONS.map((d) => directionLabel(d)).join(" ")} — fill all{" "}
        {programLength} slots to go.
      </p>
    </aside>
  );
}
