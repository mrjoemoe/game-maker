import type { ItemDefinition } from "@game-maker/engine";

type MagePickerProps = {
  items: ItemDefinition[];
  onChoose: (itemId: string) => void;
};

export function MagePicker({ items, onChoose }: MagePickerProps) {
  const sorted = [...items].sort((a, b) => a.label.localeCompare(b.label));

  return (
    <div className="mage-picker-backdrop" role="dialog" aria-modal="true" aria-labelledby="mage-picker-title">
      <div className="mage-picker">
        <h2 id="mage-picker-title">The Mage offers a gift</h2>
        <p className="mage-picker-lede">
          Choose one item. It stays with you on every retry of this map.
        </p>
        <ul className="mage-picker-list">
          {sorted.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className="mage-picker-option"
                onClick={() => onChoose(item.id)}
              >
                <span className="mage-picker-icon" aria-hidden="true">
                  {item.icon ?? "•"}
                </span>
                <span className="mage-picker-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
