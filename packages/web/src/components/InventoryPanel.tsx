import type { GameState, ItemDefinition } from "@game-maker/engine";

type InventoryPanelProps = {
  game: GameState;
};

function itemList(game: GameState): ItemDefinition[] {
  return game.run.inventory
    .map((id) => game.items[id])
    .filter((item): item is ItemDefinition => Boolean(item));
}

export function InventoryPanel({ game }: InventoryPanelProps) {
  const items = itemList(game);

  return (
    <aside className="inventory-panel" aria-label="Inventory">
      <h2>Inventory</h2>
      <p className="inventory-lede">Gear you carry across attempts on this map.</p>
      {items.length === 0 ? (
        <p className="inventory-empty">Empty — visit the Mage to choose your first item.</p>
      ) : (
        <ul className="inventory-list">
          {items.map((item) => (
            <li key={item.id} className="inventory-row">
              <span className="inventory-icon" aria-hidden="true">
                {item.icon ?? "•"}
              </span>
              <span className="inventory-label">{item.label}</span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
