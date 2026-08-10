import type { GameState } from "@game-maker/engine";

type RunHudProps = {
  game: GameState;
  onSoftReset: () => void;
};

export function RunHud({ game, onSoftReset }: RunHudProps) {
  const { run, items } = game;
  const hpPct = Math.max(0, Math.min(100, (run.hp / run.maxHp) * 100));
  const ended = run.status !== "playing";

  return (
    <div className="run-hud">
      <div className="run-meta">
        <span>Attempt {run.attempts}</span>
        <span>
          HP {run.hp}/{run.maxHp}
        </span>
      </div>
      <div
        className="hp-bar"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={run.maxHp}
        aria-valuenow={run.hp}
        aria-label="Hit points"
      >
        <div className="hp-fill" style={{ width: `${hpPct}%` }} />
      </div>
      <div className="inventory" aria-label="Inventory">
        {run.inventory.length === 0 ? (
          <span className="inventory-empty">No gear yet</span>
        ) : (
          run.inventory.map((id) => {
            const item = items[id];
            return (
              <span key={id} className="item-chip" title={item?.label ?? id}>
                {item?.icon ?? item?.label ?? id}
              </span>
            );
          })
        )}
      </div>
      {run.bump && run.status === "playing" ? (
        <p className="run-bump" role="status">
          {run.bump}
        </p>
      ) : null}
      {ended ? (
        <div className={`run-banner ${run.status}`}>
          <p>
            {run.status === "won"
              ? "You reached the castle!"
              : (run.bump ?? "Path over — you lose.")}
          </p>
          <button type="button" onClick={onSoftReset}>
            Try again
          </button>
        </div>
      ) : null}
    </div>
  );
}
