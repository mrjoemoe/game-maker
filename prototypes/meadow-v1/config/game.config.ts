import {
  createDefaultCatalog,
  meadowV1Variant,
  resolveVariant,
} from "@game-maker/game-library";

/**
 * Meadow v1 — composed from canonical library components.
 */
const resolved = resolveVariant(meadowV1Variant, createDefaultCatalog());

export const meadowV1Manifest = meadowV1Variant;
export const meadowV1 = resolved.definition;
export default meadowV1;
