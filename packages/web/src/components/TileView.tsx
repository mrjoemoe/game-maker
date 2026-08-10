import type { Coord, PieceInstance, TileState, TileTypeDefinition } from "@game-maker/engine";

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

  return (
    <button
      type="button"
      className={`tile${selected ? " selected" : ""}${tile.isFaceUp ? "" : " face-down"}`}
      style={faceStyle}
      onClick={onClick}
      aria-label={
        tile.isFaceUp
          ? `Tile ${coord.x},${coord.y} ${tileType.label}`
          : `Tile ${coord.x},${coord.y} face down`
      }
    >
      <span className="tile-label">
        {tile.isFaceUp ? tileType.label : "Hidden"}
      </span>
      {piece ? (
        <span
          className="piece"
          style={{ background: pieceColor ?? "#333", borderColor: selected ? "#fff" : "transparent" }}
        >
          {pieceLabel ?? piece.typeId}
        </span>
      ) : null}
    </button>
  );
}
