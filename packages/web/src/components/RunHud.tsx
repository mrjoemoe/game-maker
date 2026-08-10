import type { GameState } from "@game-maker/engine";

type RunHudProps = {
  game: GameState;
  onSoftReset: () => void;
};

export function RunHud({ game, onSoftReset }: RunHudProps) {
  const { run, stashItemIds, coins } = game;
  const hpPct = Math.max(0, Math.min(100, (run.hp / run.maxHp) * 100));
  const ended = run.status !== "playing";

  const bannerMessage = (): string => {
    switch (run.status) {
      case "won":
        return "You reached the castle! Remaining gear was banked to your stash.";
      case "extracted":
        return "Extracted — carried gear is banked in your stash.";
      case "lost":
        return run.bump ?? "Path over — gear on your person is lost.";
      default:
        return "";
    }
  };

  return (
    <div className="run-hud">
      <div className="run-hud-top">
        <div className="run-meta">
          <span>Attempt {run.attempts}</span>
          <span>
            HP {run.hp}/{run.maxHp}
          </span>
          <span>Stash {stashItemIds.length}</span>
          <span>Carrying {run.inventory.length}</span>
        </div>
        <div
          className="coin-wallet"
          role="status"
          aria-label={`Coin wallet ${coins}`}
        >
          <span className="coin-wallet-icon" aria-hidden="true">
            🪙
          </span>
          <span className="coin-wallet-label">Coins</span>
          <span className="coin-wallet-count">{coins}</span>
        </div>
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
      {run.bump && run.status === "playing" ? (
        <p className="run-bump" role="status">
          {run.bump}
        </p>
      ) : null}
      {ended ? (
        <div className={`run-banner ${run.status}`}>
          <p>{bannerMessage()}</p>
          <button type="button" onClick={onSoftReset}>
            Try again
          </button>
        </div>
      ) : null}
    </div>
  );
}
