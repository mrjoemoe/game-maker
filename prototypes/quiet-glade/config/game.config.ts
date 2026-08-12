import {
  createDefaultCatalog,
  quietGladeVariant,
  resolveVariant,
} from "@game-maker/game-library";

/** Quiet Glade — composed variant; tile flip disabled. */
const resolved = resolveVariant(quietGladeVariant, createDefaultCatalog());

export const quietGladeManifest = quietGladeVariant;
export const quietGlade = resolved.definition;
export default quietGlade;
