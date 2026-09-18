import {
  edgeWallSegments,
  type EdgeWallSegment,
  type GameState,
} from "@game-maker/engine";

type BoardWallsProps = {
  game: GameState;
};

function segmentKey(segment: EdgeWallSegment): string {
  return `${segment.axis}:${segment.x},${segment.y}`;
}

function segmentLine(segment: EdgeWallSegment) {
  if (segment.axis === "h") {
    return {
      x1: segment.x + 1,
      y1: segment.y,
      x2: segment.x + 1,
      y2: segment.y + 1,
    };
  }
  return {
    x1: segment.x,
    y1: segment.y + 1,
    x2: segment.x + 1,
    y2: segment.y + 1,
  };
}

export function BoardWalls({ game }: BoardWallsProps) {
  const { width, height } = game.board.grid;
  const segments = edgeWallSegments(game.board.edgeWalls);
  if (segments.length === 0) {
    return null;
  }

  return (
    <svg
      className="board-walls"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {segments.map((segment) => {
        const line = segmentLine(segment);
        return (
          <g key={segmentKey(segment)}>
            <line
              className="board-wall-stroke board-wall-stroke-outer"
              vectorEffect="non-scaling-stroke"
              {...line}
            />
            <line
              className="board-wall-stroke board-wall-stroke-inner"
              vectorEffect="non-scaling-stroke"
              {...line}
            />
          </g>
        );
      })}
    </svg>
  );
}
