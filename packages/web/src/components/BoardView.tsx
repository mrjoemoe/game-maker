import {
  cellEdgeWallSides,
  coordKey,
  pieceAt,
  resolveTileType,
  type Coord,
  type Direction,
  type GameState,
} from "@game-maker/engine";
import { BoardWalls } from "./BoardWalls";
import { TileView } from "./TileView";

type BoardViewProps = {
  game: GameState;
  selectedPieceId: string | null;
  onCellClick: (coord: Coord) => void;
  /** Debug: show every tile face-up without mutating game state. */
  forceRevealAll?: boolean;
  heroFacing?: Direction;
  showCoords?: boolean;
  pathKeys?: ReadonlySet<string>;
  hoverKeys?: ReadonlySet<string>;
  stepping?: boolean;
  onCellHover?: (coord: Coord | null) => void;
};

export function BoardView({
  game,
  selectedPieceId,
  onCellClick,
  forceRevealAll = false,
  heroFacing = "down",
  showCoords = false,
  pathKeys,
  hoverKeys,
  stepping = false,
  onCellHover,
}: BoardViewProps) {
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
    <div className="board-frame">
      <div
        className="board"
        onMouseLeave={() => onCellHover?.(null)}
        style={{
          gridTemplateColumns: `repeat(${width}, minmax(72px, 1fr))`,
        }}
      >
        {rows.flat().map((coord) => {
          const tile = game.board.cells[coordKey(coord)];
          const tileType = resolveTileType(game.board.tileTypes, tile.typeId);
          const piece = pieceAt(game.pieces, coord);
          const pieceType = piece ? game.pieceTypes[piece.typeId] : undefined;
          const walls = cellEdgeWallSides(game.board.edgeWalls, coord);
          const heroId = game.definition.run?.heroPieceId;
          const isHero = Boolean(
            piece &&
              (piece.id === heroId || piece.typeId === "hero"),
          );
          return (
            <TileView
              key={coordKey(coord)}
              coord={coord}
              tile={tile}
              tileType={tileType}
              walls={walls}
              forceFaceUp={forceRevealAll}
              piece={piece}
              pieceLabel={pieceType?.label ?? pieceType?.icon}
              pieceColor={pieceType?.color}
              isHero={isHero}
              facing={isHero ? heroFacing : undefined}
              showCoords={showCoords}
              pathHighlight={
                piece
                  ? undefined
                  : pathKeys?.has(coordKey(coord))
                    ? hoverKeys?.has(coordKey(coord))
                      ? "both"
                      : "queued"
                    : hoverKeys?.has(coordKey(coord))
                      ? "hover"
                      : undefined
              }
              stepping={Boolean(stepping && piece && piece.id === selectedPieceId)}
              selected={Boolean(piece && piece.id === selectedPieceId)}
              onClick={() => onCellClick(coord)}
              onHover={onCellHover ? (inside) => onCellHover(inside ? coord : null) : undefined}
            />
          );
        })}
      </div>
      <BoardWalls game={game} />
    </div>
  );
}
