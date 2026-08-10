import {
  tileEffect,
  type Coord,
  type PieceInstance,
  type TileState,
  type TileTypeDefinition,
} from "@game-maker/engine";

type TileViewProps = {
  coord: Coord;
  tile: TileState;
  tileType: TileTypeDefinition;
  piece?: PieceInstance;
  pieceLabel?: string;
  pieceColor?: string;
  selected: boolean;
  onClick: () => void;
};

function effectIcon(tileType: TileTypeDefinition, resolved?: boolean): string | null {
  const effect = tileEffect(tileType);
  switch (effect.kind) {
    case "empty":
      return tileType.id === "forest" ? "🌲" : "🌿";
    case "wall":
      return "🪨";
    case "trap":
      return "🕳️";
    case "enemy":
      return resolved ? "💀" : "👹";
    case "powerup":
      return resolved ? "📦" : "⚔️";
    case "goal":
      return "🏰";
    default:
      return null;
  }
}

export function TileView({
  coord,
  tile,
  tileType,
  piece,
  pieceLabel,
  pieceColor,
  selected,
  onClick,
}: TileViewProps) {
  const faceStyle = tile.isFaceUp
    ? { background: tileType.color }
    : { background: "var(--face-down)" };
  const icon = tile.isFaceUp ? effectIcon(tileType, tile.resolved) : null;
  const resolvedClass = tile.resolved ? " resolved" : "";

  return (
    <button
      type="button"
      className={`tile${selected ? " selected" : ""}${tile.isFaceUp ? "" : " face-down"}${resolvedClass}`}
      style={faceStyle}
      onClick={onClick}
      aria-label={
        tile.isFaceUp
          ? `Tile ${coord.x},${coord.y} ${tileType.label}${tile.resolved ? " cleared" : ""}`
          : `Tile ${coord.x},${coord.y} face down`
      }
    >
      {icon ? <span className="tile-icon">{icon}</span> : null}
      <span className="tile-label">
        {tile.isFaceUp ? tileType.label : "Hidden"}
      </span>
      {piece ? (
        <span
          className="piece"
          style={{
            background: pieceColor ?? "#333",
            borderColor: selected ? "#fff" : "transparent",
          }}
        >
          {pieceLabel ?? piece.typeId}
        </span>
      ) : null}
    </button>
  );
}
