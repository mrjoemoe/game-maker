import {
  directionLabel,
  PORTAL_IDS,
  programActionLabel,
  SHOP_ITEM_COST,
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
  coins: number;
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
  coins,
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
  const chartEndedWithExtract = steps.some(
    (step) => step.action.kind === "extract",
  );
  const canExecute =
    steps.length >= 1 && !disabled && executingIndex === null;
  const locked =
    disabled || full || executingIndex !== null || chartEndedWithExtract;
  const sortedItems = [...items].sort((a, b) => a.label.localeCompare(b.label));

  // Project inventory and coins across the queued plan.
  const availableIds = new Set(inventory);
  let projectedCoins = coins;
  for (const step of steps) {
    if (step.action.kind === "takeFromMage") {
      availableIds.add(step.action.itemId);
    } else if (step.action.kind === "buyFromShop") {
      availableIds.add(step.action.itemId);
      projectedCoins -= SHOP_ITEM_COST;
    } else if (step.action.kind === "useItem") {
      availableIds.delete(step.action.itemId);
    }
  }
  const canAffordBuy = projectedCoins >= SHOP_ITEM_COST;

  const actionSummary = (action: ProgramAction): string => {
    if (
      action.kind === "none" ||
      action.kind === "extract" ||
      action.kind === "travelToPortal"
    ) {
      return programActionLabel(action);
    }
    const item = items.find((i) => i.id === action.itemId);
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
    if (draftAction.kind === "buyFromShop" && !canAffordBuy) {
      return;
    }
    onAppend({ action: draftAction, move });
    if (draftAction.kind === "extract") {
      setDraftAction({ kind: "none" });
    }
  };

  return (
    <aside className="path-planner" aria-label="Path planner">
      <h2>Chart path</h2>
      <p className="path-lede">
        Chart up to {programLength} action+move pairs, then run. Buy costs{" "}
        {SHOP_ITEM_COST} coins at a shop. Travel teleports between discovered
        portals. Extract ends the chart.
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
                  {step
                    ? step.action.kind === "extract"
                      ? "Leave"
                      : step.action.kind === "travelToPortal"
                        ? "Warp"
                        : directionLabel(step.move)
                    : "Move —"}
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
          <button
            type="button"
            className={
              draftAction.kind === "extract"
                ? "action-choice active"
                : "action-choice"
            }
            disabled={locked}
            title="Must be standing on an extraction tile; ends the chart"
            onClick={() => setDraftAction({ kind: "extract" })}
          >
            🚪 Extract
          </button>
          {PORTAL_IDS.map((portalId) => (
            <button
              key={`portal-${portalId}`}
              type="button"
              className={
                draftAction.kind === "travelToPortal" &&
                draftAction.portalId === portalId
                  ? "action-choice active"
                  : "action-choice"
              }
              disabled={locked}
              title={`Must stand on a portal; destination Portal ${portalId} must already be discovered`}
              onClick={() =>
                setDraftAction({ kind: "travelToPortal", portalId })
              }
            >
              🌀 Travel to Portal {portalId}
            </button>
          ))}
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
          {sortedItems.map((item) => (
            <button
              key={`buy-${item.id}`}
              type="button"
              className={
                draftAction.kind === "buyFromShop" &&
                draftAction.itemId === item.id
                  ? "action-choice active"
                  : "action-choice"
              }
              disabled={locked || !canAffordBuy}
              title={
                canAffordBuy
                  ? `Buy ${item.label} for ${SHOP_ITEM_COST} coins at a shop`
                  : `Need ${SHOP_ITEM_COST} coins`
              }
              onClick={() =>
                setDraftAction({ kind: "buyFromShop", itemId: item.id })
              }
            >
              {item.icon ? `${item.icon} ` : ""}Buy {item.label} ({SHOP_ITEM_COST}🪙)
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
                    : `Need ${item.label} in inventory (or take/buy it earlier in this path)`
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

        <p className="path-compose-label">
          {draftAction.kind === "extract"
            ? "2. Confirm leave (direction unused)"
            : "2. Move"}
        </p>
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
          {chartEndedWithExtract ? (
            <>
              Chart ends with <strong>Extract</strong> — Undo or Clear to change
              it.
            </>
          ) : (
            <>
              Next: <strong>{actionSummary(draftAction)}</strong>
              {draftAction.kind === "extract"
                ? ", then confirm leave"
                : ", then direction"}{" "}
              · Coins after chart: {Math.max(0, projectedCoins)}
              {draftAction.kind === "buyFromShop"
                ? ` (−${SHOP_ITEM_COST})`
                : ""}
            </>
          )}
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
