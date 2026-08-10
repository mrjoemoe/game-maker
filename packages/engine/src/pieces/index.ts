import { isInBounds, type Coord, type GridConfig } from "../grid/index.js";

export type PieceTypeDefinition = {
  id: string;
  label: string;
  color: string;
  icon?: string;
};

export type PieceInstance = {
  id: string;
  typeId: string;
  position: Coord;
};

export type PieceTypeRegistry = Record<string, PieceTypeDefinition>;

export function createPieceTypeRegistry(
  types: PieceTypeDefinition[],
): PieceTypeRegistry {
  const registry: PieceTypeRegistry = {};
  for (const type of types) {
    if (registry[type.id]) {
      throw new Error(`Duplicate piece type id: ${type.id}`);
    }
    registry[type.id] = type;
  }
  return registry;
}

export function movePiece(
  pieces: PieceInstance[],
  pieceId: string,
  destination: Coord,
  grid: GridConfig,
): PieceInstance[] {
  if (!isInBounds(grid, destination)) {
    throw new Error(
      `Destination out of bounds: (${destination.x}, ${destination.y})`,
    );
  }
  const index = pieces.findIndex((p) => p.id === pieceId);
  if (index < 0) {
    throw new Error(`Unknown piece id: ${pieceId}`);
  }
  return pieces.map((piece, i) =>
    i === index ? { ...piece, position: { ...destination } } : piece,
  );
}

export function pieceAt(
  pieces: PieceInstance[],
  coord: Coord,
): PieceInstance | undefined {
  return pieces.find(
    (p) => p.position.x === coord.x && p.position.y === coord.y,
  );
}
