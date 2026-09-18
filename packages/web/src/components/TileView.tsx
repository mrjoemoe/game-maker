import {
  tileEffect,
  type Coord,
  type Direction,
  type PieceInstance,
  type TileSide,
  type TileState,
  type TileTypeDefinition,
} from "@game-maker/engine";
import type { CSSProperties } from "react";
import { HeroToken, PawnToken } from "./HeroToken";

type TileViewProps = {
  coord: Coord;
  tile: TileState;
  tileType: TileTypeDefinition;
  /** Shared edge walls bordering this cell (from board.edgeWalls). */
  walls?: TileSide[];
  /** Debug: show face-up content without changing game state. */
  forceFaceUp?: boolean;
  piece?: PieceInstance;
  pieceLabel?: string;
  pieceColor?: string;
  isHero?: boolean;
  facing?: Direction;
  showCoords?: boolean;
  pathHighlight?: "queued" | "hover" | "both";
  stepping?: boolean;
  selected: boolean;
  onClick: () => void;
  onHover?: (inside: boolean) => void;
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
    case "portal":
      return `🌀${effect.portalId}`;
    default:
      return null;
  }
}

export function TileView({
  coord,
  tile,
  tileType,
  walls: edgeWallSides = [],
  forceFaceUp = false,
  piece,
  pieceLabel,
  pieceColor,
  isHero = false,
  facing = "down",
  showCoords = false,
  pathHighlight,
  stepping = false,
  selected,
  onClick,
  onHover,
}: TileViewProps) {
  const shownFaceUp = tile.isFaceUp || forceFaceUp;
  const faceStyle: CSSProperties = shownFaceUp
    ? { background: tileType.color }
    : { background: "var(--face-down)" };
  const icon = shownFaceUp ? effectIcon(tileType, tile.resolved) : null;
  const resolvedClass = tile.resolved ? " resolved" : "";
  const isSolidWall =
    shownFaceUp && tileEffect(tileType).kind === "wall";
  const walls = edgeWallSides;
  const wallLabel =
    walls.length > 0 ? ` walls ${walls.join(",")}` : "";
  const occupant =
    piece && (pieceLabel ?? piece.typeId)
      ? ` with ${pieceLabel ?? piece.typeId}`
      : "";

  return (
    <button
      type="button"
      className={`tile${selected ? " selected" : ""}${shownFaceUp ? "" : " face-down"}${resolvedClass}${isSolidWall ? " solid-wall" : ""}${forceFaceUp && !tile.isFaceUp ? " debug-peek" : ""}${pathHighlight ? ` path-${pathHighlight}` : ""}`}
      style={faceStyle}
      onClick={onClick}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      aria-label={
        shownFaceUp
          ? `Tile ${coord.x},${coord.y} ${tileType.label}${tile.resolved ? " cleared" : ""}${wallLabel}${isSolidWall ? " blocked" : ""}${occupant}${forceFaceUp && !tile.isFaceUp ? " debug peek" : ""}`
          : `Tile ${coord.x},${coord.y} face down${wallLabel}${occupant}`
      }
    >
      {showCoords ? (
        <span className="tile-coords" aria-hidden="true">
          {coord.x},{coord.y}
        </span>
      ) : null}
      {isSolidWall ? (
        <span className="solid-wall-frame" aria-hidden="true" />
      ) : null}
      {icon ? <span className="tile-icon">{icon}</span> : null}
      {shownFaceUp && (tile.coins ?? 0) > 0 ? (
        <span className="tile-coins" aria-label={`${tile.coins} coins`}>
          <span aria-hidden="true">🪙</span>
          <span className="tile-coins-count">{tile.coins}</span>
        </span>
      ) : null}
      <span className="tile-label">
        {shownFaceUp ? tileType.label : "Hidden"}
      </span>
      {piece ? (
        isHero ? (
          <HeroToken
            color={pieceColor ?? "#c47a2c"}
            label={pieceLabel ?? piece.typeId}
            selected={selected}
            facing={facing}
            stepping={stepping}
          />
        ) : (
          <PawnToken
            color={pieceColor ?? "#333"}
            label={pieceLabel ?? piece.typeId}
            selected={selected}
          />
        )
      ) : null}
    </button>
  );
}
