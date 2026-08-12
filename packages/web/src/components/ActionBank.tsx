import {
  PORTAL_IDS,
  SHOP_ITEM_COST,
  type ItemDefinition,
  type ProgramStep,
} from "@game-maker/engine";

type ActionBankProps = {
  programLength: number;
  steps: ProgramStep[];
  items: ItemDefinition[];
  inventory: string[];
  coins: number;
  disabled: boolean;
  executing: boolean;
  onAppend: (step: ProgramStep) => void;
};

export function ActionBank({
  programLength,
  steps,
  items,
  inventory,
  coins,
  disabled,
  executing,
  onAppend,
}: ActionBankProps) {
  const full = steps.length >= programLength;
  const chartEndedWithExtract = steps.some((step) => step.kind === "extract");
  const locked = disabled || full || executing || chartEndedWithExtract;
  const sortedItems = [...items].sort((a, b) => a.label.localeCompare(b.label));

  const availableIds = new Set(inventory);
  let projectedCoins = coins;
  for (const step of steps) {
    if (step.kind === "takeFromMage") {
      availableIds.add(step.itemId);
    } else if (step.kind === "buyFromShop") {
      availableIds.add(step.itemId);
      projectedCoins -= SHOP_ITEM_COST;
    } else if (step.kind === "useItem") {
      availableIds.delete(step.itemId);
    }
  }
  const canAffordBuy = projectedCoins >= SHOP_ITEM_COST;

  const append = (step: ProgramStep) => {
    if (locked) return;
    if (step.kind === "useItem" && !availableIds.has(step.itemId)) return;
    if (step.kind === "buyFromShop" && !canAffordBuy) return;
    onAppend(step);
  };

  return (
    <aside className="action-bank" aria-label="Action bank">
      <h2>Actions</h2>
      <div className="path-action-choices" role="group" aria-label="Actions">
        <button
          type="button"
          className="action-choice"
          disabled={locked}
          aria-label="Up"
          onClick={() => append({ kind: "move", direction: "up" })}
        >
          ↑ Up
        </button>
        <button
          type="button"
          className="action-choice"
          disabled={locked}
          aria-label="Left"
          onClick={() => append({ kind: "move", direction: "left" })}
        >
          ← Left
        </button>
        <button
          type="button"
          className="action-choice"
          disabled={locked}
          aria-label="Down"
          onClick={() => append({ kind: "move", direction: "down" })}
        >
          ↓ Down
        </button>
        <button
          type="button"
          className="action-choice"
          disabled={locked}
          aria-label="Right"
          onClick={() => append({ kind: "move", direction: "right" })}
        >
          → Right
        </button>
        <button
          type="button"
          className="action-choice"
          disabled={locked}
          title="Must be standing on an extraction tile; ends the chart"
          onClick={() => append({ kind: "extract" })}
        >
          🚪 Extract
        </button>
        {PORTAL_IDS.map((portalId) => (
          <button
            key={`portal-${portalId}`}
            type="button"
            className="action-choice"
            disabled={locked}
            title={`Must stand on a portal; destination Portal ${portalId} must already be discovered`}
            onClick={() => append({ kind: "travelToPortal", portalId })}
          >
            🌀 Travel to Portal {portalId}
          </button>
        ))}
        {sortedItems.map((item) => (
          <button
            key={`take-${item.id}`}
            type="button"
            className="action-choice"
            disabled={locked}
            onClick={() => append({ kind: "takeFromMage", itemId: item.id })}
          >
            {item.icon ? `${item.icon} ` : ""}Take {item.label}
          </button>
        ))}
        {sortedItems.map((item) => (
          <button
            key={`buy-${item.id}`}
            type="button"
            className="action-choice"
            disabled={locked || !canAffordBuy}
            title={
              canAffordBuy
                ? `Buy ${item.label} for ${SHOP_ITEM_COST} coins at a shop`
                : `Need ${SHOP_ITEM_COST} coins`
            }
            onClick={() => append({ kind: "buyFromShop", itemId: item.id })}
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
              className="action-choice"
              disabled={locked || !held}
              title={
                held
                  ? `Use ${item.label} (then add a move)`
                  : `Need ${item.label} in inventory (or take/buy it earlier)`
              }
              onClick={() => append({ kind: "useItem", itemId: item.id })}
            >
              {item.icon ? `${item.icon} ` : ""}Use {item.label}
            </button>
          );
        })}
      </div>

      <p className="path-draft">
        {chartEndedWithExtract ? (
          <>
            Chart ends with <strong>Extract</strong> — Undo or Clear to change
            it.
          </>
        ) : (
          <>
            {steps.length}/{programLength} actions · Coins after chart:{" "}
            {Math.max(0, projectedCoins)}
          </>
        )}
      </p>
    </aside>
  );
}
