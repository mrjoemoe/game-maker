import { resolveTileType, type GameState } from "@game-maker/engine";

type TileTallyProps = {
  game: GameState;
};

type TallyRow = {
  typeId: string;
  label: string;
  color: string;
  total: number;
  revealed: number;
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
      return {
        typeId,
        label: type.label,
        color: type.color,
        total,
        revealed,
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
            <span className="tally-count" title={`${row.revealed} revealed`}>
              {row.total}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
