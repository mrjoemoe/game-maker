import {
  resolveItem,
  resolveTileType,
  type GameState,
} from "@game-maker/engine";

type TileTallyProps = {
  game: GameState;
};

type TallyRow = {
  typeId: string;
  label: string;
  color: string;
  total: number;
  revealed: number;
  passItemLabel: string | null;
  passItemIcon: string | null;
};

function buildTally(game: GameState): TallyRow[] {
  const counts = new Map<string, { total: number; revealed: number }>();

  for (const cell of Object.values(game.board.cells)) {
    const entry = counts.get(cell.typeId) ?? { total: 0, revealed: 0 };
    entry.total += 1;
    if (cell.isFaceUp) {
      entry.revealed += 1;
    }
    counts.set(cell.typeId, entry);
  }

  return [...counts.entries()]
    .map(([typeId, { total, revealed }]) => {
      const type = resolveTileType(game.board.tileTypes, typeId);
      let passItemLabel: string | null = null;
      let passItemIcon: string | null = null;
      if (type.passItemId) {
        try {
          const item = resolveItem(game.items, type.passItemId);
          passItemLabel = item.label;
          passItemIcon = item.icon ?? null;
        } catch {
          passItemLabel = type.passItemId;
        }
      }
      return {
        typeId,
        label: type.label,
        color: type.color,
        total,
        revealed,
        passItemLabel,
        passItemIcon,
      };
    })
    .sort((a, b) => b.total - a.total || a.label.localeCompare(b.label));
}

export function TileTally({ game }: TileTallyProps) {
  const rows = buildTally(game);

  return (
    <aside className="tile-tally" aria-label="Tile counts">
      <h2>Tile counts</h2>
      <p className="tally-lede">How many of each tile are on this map.</p>
      <ul className="tally-list">
        {rows.map((row) => (
          <li key={row.typeId} className="tally-row">
            <span
              className="tally-swatch"
              style={{ background: row.color }}
              aria-hidden="true"
            />
            <span className="tally-label">{row.label}</span>
            <span className="tally-pass">
              {row.passItemLabel ? (
                <span
                  className="tally-pass-item"
                  title={`Pass with ${row.passItemLabel}`}
                >
                  {row.passItemIcon ? (
                    <span aria-hidden="true">{row.passItemIcon}</span>
                  ) : null}{" "}
                  {row.passItemLabel}
                </span>
              ) : (
                <span className="tally-pass-none">—</span>
              )}
            </span>
            <span className="tally-count" title={`${row.revealed} revealed`}>
              {row.total}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
