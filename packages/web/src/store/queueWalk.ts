import {
  coordKey,
  destinationFrom,
  isCrossingBlocked,
  projectWalk,
  resolveTileType,
  shortestWalkDirections,
  tileEffect,
  type Coord,
  type Direction,
  type GameState,
  type ProgramStep,
} from "@game-maker/engine";

export function queuedMoveDirections(steps: ProgramStep[]): Direction[] {
  return steps
    .filter((step): step is ProgramStep & { kind: "move" } => step.kind === "move")
    .map((step) => step.direction);
}

export function projectedHeroPosition(
  game: GameState,
  steps: ProgramStep[],
): Coord | null {
  const heroId = game.definition.run?.heroPieceId;
  const hero = game.pieces.find((piece) => piece.id === heroId);
  if (!hero) return null;
  return projectWalk(hero.position, queuedMoveDirections(steps));
}

function isKnownSolidWall(game: GameState, coord: Coord): boolean {
  const cell = game.board.cells[coordKey(coord)];
  if (!cell?.isFaceUp) return false;
  const tileType = resolveTileType(game.board.tileTypes, cell.typeId);
  return tileEffect(tileType).kind === "wall";
}

export function walkMovesToQueue(
  game: GameState,
  steps: ProgramStep[],
  destination: Coord,
  remainingSlots: number,
): ProgramStep[] {
  if (remainingSlots < 1) return [];
  const origin = projectedHeroPosition(game, steps);
  if (!origin) return [];
  const dirs = shortestWalkDirections(
    game.board.grid,
    origin,
    destination,
    {
      isCrossingBlocked: (from, to) =>
        isCrossingBlocked(game.board.edgeWalls, from, to),
      isCellBlocked: (coord) => isKnownSolidWall(game, coord),
    },
  );
  if (!dirs || dirs.length === 0) return [];
  return dirs.slice(0, remainingSlots).map((direction) => ({
    kind: "move" as const,
    direction,
  }));
}

export function cellsAlongMoves(
  origin: Coord,
  steps: ProgramStep[],
): Coord[] {
  const cells: Coord[] = [];
  let pos = { ...origin };
  for (const step of steps) {
    if (step.kind !== "move") continue;
    pos = destinationFrom(pos, step.direction);
    cells.push({ ...pos });
  }
  return cells;
}

export function canQueueWalk(
  steps: ProgramStep[],
  remainingSlots: number,
  executing: boolean,
  runPlaying: boolean,
): boolean {
  if (!runPlaying || executing || remainingSlots < 1) return false;
  return !steps.some((step) => step.kind === "extract");
}
