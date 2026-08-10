import {
  directionLabel,
  programActionLabel,
  type Direction,
  type ItemDefinition,
  type ProgramAction,
  type ProgramStep,
} from "@game-maker/engine";
import { useState } from "react";

type PathPlannerProps = {
  programLength: number;
  steps: ProgramStep[];
  items: ItemDefinition[];
  inventory: string[];
  executingIndex: number | null;
  disabled: boolean;
  onAppend: (step: ProgramStep) => void;
  onUndo: () => void;
  onClear: () => void;
  onExecute: () => void;
};

export function PathPlanner({
  programLength,
  steps,
  items,
  inventory,
  executingIndex,
  disabled,
  onAppend,
  onUndo,
  onClear,
  onExecute,
}: PathPlannerProps) {
  const [draftAction, setDraftAction] = useState<ProgramAction>({
    kind: "none",
  });

  const full = steps.length >= programLength;
  const canExecute =
    steps.length >= 1 && !disabled && executingIndex === null;
  const locked = disabled || full || executingIndex !== null;
  const sortedItems = [...items].sort((a, b) => a.label.localeCompare(b.label));

  // Items already held, plus gear taken in earlier queued steps of this plan.
  const availableIds = new Set(inventory);
  for (const step of steps) {
    if (step.action.kind === "takeFromMage") {
      availableIds.add(step.action.itemId);
    }
  }

  const actionSummary = (action: ProgramAction): string => {
    const item =
      action.kind === "none"
        ? undefined
        : items.find((i) => i.id === action.itemId);
    return programActionLabel(action, item?.label);
  };

  const commitMove = (move: Direction) => {
    if (locked) {
      return;
    }
    if (
      draftAction.kind === "useItem" &&
      !availableIds.has(draftAction.itemId)
    ) {
      return;
    }
    onAppend({ action: draftAction, move });
  };

  return (
    <aside className="path-planner" aria-label="Path planner">
      <h2>Chart path</h2>
      <p className="path-lede">
        Chart up to {programLength} action+move pairs, then run — you can go
        with fewer steps to end the chart early. Wrong actions end the run.
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
              <span className="slot-body">
                <span className="slot-action">
                  {step ? actionSummary(step.action) : "Action —"}
                </span>
                <span className="slot-dir">
                  {step ? directionLabel(step.move) : "Move —"}
                </span>
              </span>
            </li>
          );
        })}
      </ol>

      <div className="path-compose">
        <p className="path-compose-label">1. Action for next step</p>
        <div className="path-action-choices" role="group" aria-label="Step action">
          <button
            type="button"
            className={
              draftAction.kind === "none" ? "action-choice active" : "action-choice"
            }
            disabled={locked}
            onClick={() => setDraftAction({ kind: "none" })}
          >
            No action
          </button>
          {sortedItems.map((item) => (
            <button
              key={`take-${item.id}`}
              type="button"
              className={
                draftAction.kind === "takeFromMage" &&
                draftAction.itemId === item.id
                  ? "action-choice active"
                  : "action-choice"
              }
              disabled={locked}
              onClick={() =>
                setDraftAction({ kind: "takeFromMage", itemId: item.id })
              }
            >
              {item.icon ? `${item.icon} ` : ""}Take {item.label}
            </button>
          ))}
          {sortedItems.map((item) => {
            const held = availableIds.has(item.id);
            return (
              <button
                key={`use-${item.id}`}
                type="button"
                className={
                  draftAction.kind === "useItem" && draftAction.itemId === item.id
                    ? "action-choice active"
                    : "action-choice"
                }
                disabled={locked || !held}
                title={
                  held
                    ? `Use ${item.label}`
                    : `Need ${item.label} in inventory (or take it earlier in this path)`
                }
                onClick={() =>
                  setDraftAction({ kind: "useItem", itemId: item.id })
                }
              >
                {item.icon ? `${item.icon} ` : ""}Use {item.label}
              </button>
            );
          })}
        </div>

        <p className="path-compose-label">2. Move</p>
        <div className="path-pad" role="group" aria-label="Add move">
          <button
            type="button"
            className="pad-btn pad-up"
            disabled={locked}
            onClick={() => commitMove("up")}
            aria-label="Up"
          >
            ↑
          </button>
          <div className="pad-row">
            <button
              type="button"
              className="pad-btn"
              disabled={locked}
              onClick={() => commitMove("left")}
              aria-label="Left"
            >
              ←
            </button>
            <button
              type="button"
              className="pad-btn"
              disabled={locked}
              onClick={() => commitMove("down")}
              aria-label="Down"
            >
              ↓
            </button>
            <button
              type="button"
              className="pad-btn"
              disabled={locked}
              onClick={() => commitMove("right")}
              aria-label="Right"
            >
              →
            </button>
          </div>
        </div>
        <p className="path-draft">
          Next: <strong>{actionSummary(draftAction)}</strong>, then direction
        </p>
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
          {steps.length > 0 && steps.length < programLength
            ? `Run ${steps.length} step${steps.length === 1 ? "" : "s"}`
            : "Run path"}
        </button>
      </div>
    </aside>
  );
}
