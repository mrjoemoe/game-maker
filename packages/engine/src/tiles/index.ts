export type TileTypeDefinition = {
  id: string;
  label: string;
  color: string;
  /** Optional free-form metadata for prototypes. */
  props?: Record<string, unknown>;
};

export type TileState = {
  typeId: string;
  isFaceUp: boolean;
};

export type TileTypeRegistry = Record<string, TileTypeDefinition>;

export function createTileTypeRegistry(
  types: TileTypeDefinition[],
): TileTypeRegistry {
  if (types.length === 0) {
    throw new Error("At least one tile type is required");
  }
  const registry: TileTypeRegistry = {};
  for (const type of types) {
    if (registry[type.id]) {
      throw new Error(`Duplicate tile type id: ${type.id}`);
    }
    registry[type.id] = type;
  }
  return registry;
}

export function resolveTileType(
  registry: TileTypeRegistry,
  typeId: string,
): TileTypeDefinition {
  const type = registry[typeId];
  if (!type) {
    throw new Error(`Unknown tile type id: ${typeId}`);
  }
  return type;
}

export function createTileState(
  typeId: string,
  isFaceUp = true,
): TileState {
  return { typeId, isFaceUp };
}

export function flipTileState(tile: TileState): TileState {
  return { ...tile, isFaceUp: !tile.isFaceUp };
}
