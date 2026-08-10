import {
  tileEffect,
  type Coord,
  type PieceInstance,
  type TileSide,
  type TileState,
  type TileTypeDefinition,
} from "@game-maker/engine";
import type { CSSProperties } from "react";

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
    case "mage":
      return resolved ? "✨" : "🧙";
    case "goal":
      return "🏰";
    case "extraction":
      return "🚪";
    case "shop":
      return "🏪";
    default:
      return null;
  }
}

const SIDE_LABEL: Record<TileSide, string> = {
  n: "north",
  e: "east",
  s: "south",
  w: "west",
};

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
  const faceStyle: CSSProperties = tile.isFaceUp
    ? { background: tileType.color }
    : { background: "var(--face-down)" };
  const icon = tile.isFaceUp ? effectIcon(tileType, tile.resolved) : null;
  const resolvedClass = tile.resolved ? " resolved" : "";
  const isSolidWall =
    tile.isFaceUp && tileEffect(tileType).kind === "wall";
  const walls = tile.isFaceUp ? (tile.walls ?? []) : [];
  const wallLabel =
    walls.length > 0 ? ` walls ${walls.join(",")}` : "";

  return (
    <button
      type="button"
      className={`tile${selected ? " selected" : ""}${tile.isFaceUp ? "" : " face-down"}${resolvedClass}${isSolidWall ? " solid-wall" : ""}`}
      style={faceStyle}
      onClick={onClick}
      aria-label={
        tile.isFaceUp
          ? `Tile ${coord.x},${coord.y} ${tileType.label}${tile.resolved ? " cleared" : ""}${wallLabel}${isSolidWall ? " blocked" : ""}`
          : `Tile ${coord.x},${coord.y} face down`
      }
    >
      {walls.map((side) => (
        <span
          key={side}
          className={`tile-wall tile-wall-${side}`}
          aria-hidden="true"
          title={`Wall on ${SIDE_LABEL[side]} side`}
        />
      ))}
      {isSolidWall ? (
        <span className="solid-wall-frame" aria-hidden="true" />
      ) : null}
      {icon ? <span className="tile-icon">{icon}</span> : null}
      {tile.isFaceUp && (tile.coins ?? 0) > 0 ? (
        <span className="tile-coins" aria-label={`${tile.coins} coins`}>
          {"🪙".repeat(Math.min(3, tile.coins ?? 0))}
        </span>
      ) : null}
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
