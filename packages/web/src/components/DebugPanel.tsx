type DebugPanelProps = {
  enabled: boolean;
  revealAll: boolean;
  showCoords: boolean;
  walkNow: boolean;
  teleport: boolean;
  inspectorText: string;
  onToggleEnabled: () => void;
  onToggleRevealAll: () => void;
  onToggleCoords: () => void;
  onToggleWalkNow: () => void;
  onToggleTeleport: () => void;
};

export function DebugPanel({
  enabled,
  revealAll,
  showCoords,
  walkNow,
  teleport,
  inspectorText,
  onToggleEnabled,
  onToggleRevealAll,
  onToggleCoords,
  onToggleWalkNow,
  onToggleTeleport,
}: DebugPanelProps) {
  return (
    <section className="debug-panel" aria-label="Debug">
      <div className="debug-panel-header">
        <h2>Debug</h2>
        <button
          type="button"
          className={enabled ? "debug-toggle active" : "debug-toggle"}
          onClick={onToggleEnabled}
          aria-pressed={enabled}
        >
          {enabled ? "Debug on" : "Debug off"}
        </button>
      </div>
      <div className="debug-tools">
        <button
          type="button"
          className={revealAll ? "debug-toggle active" : "debug-toggle"}
          onClick={onToggleRevealAll}
          aria-pressed={revealAll}
        >
          {revealAll ? "Hide unrevealed tiles" : "Flip all tiles"}
        </button>
        <button
          type="button"
          className={
            enabled && showCoords ? "debug-toggle active" : "debug-toggle"
          }
          onClick={onToggleCoords}
          aria-pressed={enabled && showCoords}
          disabled={!enabled}
        >
          Coordinates
        </button>
        <button
          type="button"
          className={
            enabled && walkNow ? "debug-toggle active" : "debug-toggle"
          }
          onClick={onToggleWalkNow}
          aria-pressed={enabled && walkNow}
          disabled={!enabled}
        >
          Walk now
        </button>
        <button
          type="button"
          className={
            enabled && teleport ? "debug-toggle active" : "debug-toggle"
          }
          onClick={onToggleTeleport}
          aria-pressed={enabled && teleport}
          disabled={!enabled}
        >
          Teleport
        </button>
      </div>
      {enabled ? (
        <p className="debug-inspector" role="status">
          {inspectorText}
        </p>
      ) : (
        <p className="debug-note">
          Turn debug on to inspect tiles, overlay coordinates, walk the hero
          immediately, or teleport.
        </p>
      )}
    </section>
  );
}
