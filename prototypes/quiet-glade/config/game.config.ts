import type { GameDefinition } from "@game-maker/engine";

/** Second prototype: no tile flipping — shows feature flags + parallel launches. */
export const quietGlade: GameDefinition = {
  id: "quiet-glade",
  name: "Quiet Glade",
  templateId: "tile-board",
  features: {
    tileFlip: false,
  },
  board: {
    grid: { width: 4, height: 4 },
    tileTypes: [
      { id: "moss", label: "Moss", color: "#5b8c5a" },
      { id: "stone", label: "Stone", color: "#9a9a9a" },
    ],
    defaultTileTypeId: "moss",
    overrides: [
      { coord: { x: 1, y: 1 }, typeId: "stone" },
      { coord: { x: 2, y: 2 }, typeId: "stone" },
    ],
  },
  pieceTypes: [
    { id: "walker", label: "Walker", color: "#6b4f3b", icon: "W" },
  ],
  initialPieces: [
    { id: "walker-1", typeId: "walker", position: { x: 0, y: 0 } },
  ],
};

export default quietGlade;
