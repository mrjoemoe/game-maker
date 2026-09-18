import {
  cellEdgeWallSides,
  coordKey,
  resolveTileType,
  tileEffect,
  type Coord,
  type GameState,
} from "@game-maker/engine";

export function describeInspectedCell(
  game: GameState,
  coord: Coord | null,
): string {
  if (!coord) {
    return "Click a tile to inspect it.";
  }
  const cell = game.board.cells[coordKey(coord)];
  if (!cell) {
    return `Out of bounds (${coord.x},${coord.y}).`;
  }
  const tileType = resolveTileType(game.board.tileTypes, cell.typeId);
  const effect = tileEffect(tileType);
  const walls = cellEdgeWallSides(game.board.edgeWalls, coord);
  const wallText = walls.length > 0 ? walls.join(",") : "none";
  return [
    `(${coord.x},${coord.y}) ${tileType.label} [${tileType.id}]`,
    cell.isFaceUp ? "face-up" : "face-down",
    cell.resolved ? "resolved" : "unresolved",
    `coins ${cell.coins ?? 0}`,
    `effect ${effect.kind}`,
    `walls ${wallText}`,
  ].join(" · ");
}
