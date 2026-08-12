import {
  programActionLabel,
  type ItemDefinition,
  type ProgramStep,
} from "@game-maker/engine";

type ActionTrackProps = {
  programLength: number;
  steps: ProgramStep[];
  items: ItemDefinition[];
  executingIndex: number | null;
  disabled: boolean;
  onUndo: () => void;
  onClear: () => void;
  onExecute: () => void;
};

export function ActionTrack({
  programLength,
  steps,
  items,
  executingIndex,
  disabled,
  onUndo,
  onClear,
  onExecute,
}: ActionTrackProps) {
  const canExecute =
    steps.length >= 1 && !disabled && executingIndex === null;

  const labelFor = (step: ProgramStep): string => {
    if (
      step.kind === "extract" ||
      step.kind === "travelToPortal" ||
      step.kind === "move"
    ) {
      return programActionLabel(step);
    }
    const item = items.find((i) => i.id === step.itemId);
    return programActionLabel(step, item?.label);
  };

  return (
    <section className="action-track" aria-label="Action track">
      <div className="action-track-header">
        <h2>Action track</h2>
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
            {steps.length > 0 && steps.length < programLength
              ? `Run ${steps.length}`
              : "Run"}
          </button>
        </div>
      </div>
      <ol className="action-track-slots">
        {Array.from({ length: programLength }, (_, i) => {
          const step = steps[i];
          const active = executingIndex === i;
          return (
            <li
              key={i}
              className={`action-track-slot${step ? " filled" : ""}${active ? " active" : ""}`}
            >
              <span className="slot-index">{i + 1}</span>
              <span className="slot-body">{step ? labelFor(step) : "—"}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
