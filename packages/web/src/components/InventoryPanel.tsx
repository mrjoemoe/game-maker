import type { GameState, ItemDefinition } from "@game-maker/engine";

type InventoryPanelProps = {
  game: GameState;
  selectedLoadout: string[];
  onToggleLoadout: (itemId: string) => void;
  onCommitLoadout: () => void;
};

function resolveItems(game: GameState, ids: string[]): ItemDefinition[] {
  return ids
    .map((id) => game.items[id])
    .filter((item): item is ItemDefinition => Boolean(item));
}

export function InventoryPanel({
  game,
  selectedLoadout,
  onToggleLoadout,
  onCommitLoadout,
}: InventoryPanelProps) {
  const runItems = resolveItems(game, game.run.inventory);
  const stashItems = resolveItems(game, game.stashItemIds);
  const canLoadout =
    game.run.status === "playing" && game.run.inventory.length === 0;

  return (
    <aside className="inventory-panel" aria-label="Inventory">
      <h2>On person</h2>
      <p className="inventory-lede">
        Gear for this attempt. Used items are spent. Extract or win to bank what
        remains.
      </p>
      {runItems.length === 0 ? (
        <p className="inventory-empty">Empty — take from the Mage or commit a loadout.</p>
      ) : (
        <ul className="inventory-list">
          {runItems.map((item) => (
            <li key={`run-${item.id}`} className="inventory-row">
              <span className="inventory-icon" aria-hidden="true">
                {item.icon ?? "•"}
              </span>
              <span className="inventory-label">{item.label}</span>
            </li>
          ))}
        </ul>
      )}

      <h2 className="inventory-stash-heading">Stash</h2>
      <p className="inventory-lede">
        Safe between runs. Only updated when you extract or win.
      </p>
      {stashItems.length === 0 ? (
        <p className="inventory-empty">Empty stash.</p>
      ) : (
        <ul className="inventory-list">
          {stashItems.map((item) => {
            const selected = selectedLoadout.includes(item.id);
            return (
              <li key={`stash-${item.id}`} className="inventory-row">
                <span className="inventory-icon" aria-hidden="true">
                  {item.icon ?? "•"}
                </span>
                <span className="inventory-label">{item.label}</span>
                {canLoadout ? (
                  <button
                    type="button"
                    className={
                      selected ? "loadout-toggle active" : "loadout-toggle"
                    }
                    onClick={() => onToggleLoadout(item.id)}
                  >
                    {selected ? "Packed" : "Pack"}
                  </button>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
      {canLoadout ? (
        <button
          type="button"
          className="loadout-commit"
          onClick={onCommitLoadout}
        >
          {selectedLoadout.length === 0
            ? "Start empty-handed"
            : `Commit loadout (${selectedLoadout.length})`}
        </button>
      ) : null}
    </aside>
  );
}
