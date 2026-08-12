import {
  createDefaultCatalog,
  goblinWoodsVariant,
  resolveVariant,
} from "@game-maker/game-library";

/**
 * Goblin Woods — composed from library items, run rules, and board layout.
 */
const resolved = resolveVariant(goblinWoodsVariant, createDefaultCatalog());

export const goblinWoodsManifest = goblinWoodsVariant;
export const goblinWoods = resolved.definition;
export default goblinWoods;
