type DebugPanelProps = {
  revealAll: boolean;
  onToggleRevealAll: () => void;
};

export function DebugPanel({ revealAll, onToggleRevealAll }: DebugPanelProps) {
  return (
    <section className="debug-panel" aria-label="Debug">
      <h2>Debug</h2>
      <button
        type="button"
        className={revealAll ? "debug-toggle active" : "debug-toggle"}
        onClick={onToggleRevealAll}
        aria-pressed={revealAll}
      >
        {revealAll ? "Hide unrevealed tiles" : "Flip all tiles"}
      </button>
      <p className="debug-note">
        Peek the full map. Hiding again only covers tiles you have not revealed
        in play.
      </p>
    </section>
  );
}
