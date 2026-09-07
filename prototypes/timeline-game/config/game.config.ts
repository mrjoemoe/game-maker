import {
  createDefaultCatalog,
  resolveVariant,
  timelineGameVariant,
} from "@game-maker/game-library";

const resolved = resolveVariant(timelineGameVariant, createDefaultCatalog());

export const timelineGameManifest = timelineGameVariant;
export const timelineGame = resolved.definition;
export default timelineGame;
