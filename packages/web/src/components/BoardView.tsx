import {
  cellEdgeWallSides,
  coordKey,
  pieceAt,
  resolveTileType,
  type Coord,
  type GameState,
} from "@game-maker/engine";
import { TileView } from "./TileView";

type BoardViewProps = {
  game: GameState;
  selectedPieceId: string | null;
  onCellClick: (coord: Coord) => void;
};

export function BoardView({ game, selectedPieceId, onCellClick }: BoardViewProps) {
  const { width, height } = game.board.grid;
  const rows: Coord[][] = [];
  for (let y = 0; y < height; y += 1) {
    const row: Coord[] = [];
    for (let x = 0; x < width; x += 1) {
      row.push({ x, y });
    }
    rows.push(row);
  }

  return (
    <div
      className="board"
      style={{
        gridTemplateColumns: `repeat(${width}, minmax(72px, 1fr))`,
      }}
    >
      {rows.flat().map((coord) => {
        const tile = game.board.cells[coordKey(coord)];
        const tileType = resolveTileType(game.board.tileTypes, tile.typeId);
        const piece = pieceAt(game.pieces, coord);
        const pieceType = piece ? game.pieceTypes[piece.typeId] : undefined;
        const walls = cellEdgeWallSides(game.board.edgeWalls, coord).filter(
          (side) => side === "e" || side === "s",
        );
        return (
          <TileView
            key={coordKey(coord)}
            coord={coord}
            tile={tile}
            tileType={tileType}
            walls={walls}
            piece={piece}
            pieceLabel={pieceType?.icon ?? pieceType?.label}
            pieceColor={pieceType?.color}
            selected={Boolean(piece && piece.id === selectedPieceId)}
            onClick={() => onCellClick(coord)}
          />
        );
      })}
    </div>
  );
}
