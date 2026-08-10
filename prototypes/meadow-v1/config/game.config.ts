import type { GameDefinition } from "@game-maker/engine";

/**
 * Meadow v1 — first playable prototype of the tile-board template.
 */
export const meadowV1: GameDefinition = {
  id: "meadow-v1",
  name: "Meadow v1",
  templateId: "tile-board",
  features: {
    tileFlip: true,
  },
  board: {
    grid: { width: 5, height: 4 },
    tileTypes: [
      { id: "grass", label: "Grass", color: "#6aa84f" },
      { id: "water", label: "Water", color: "#3d85c6" },
      { id: "path", label: "Path", color: "#c4a484" },
      { id: "rock", label: "Rock", color: "#888888" },
    ],
    defaultTileTypeId: "grass",
    overrides: [
      { coord: { x: 2, y: 1 }, typeId: "water" },
      { coord: { x: 2, y: 2 }, typeId: "water" },
      { coord: { x: 1, y: 1 }, typeId: "path" },
      { coord: { x: 3, y: 1 }, typeId: "path" },
      { coord: { x: 4, y: 3 }, typeId: "rock", isFaceUp: false },
      { coord: { x: 0, y: 3 }, typeId: "rock", isFaceUp: false },
    ],
  },
  pieceTypes: [
    { id: "scout", label: "Scout", color: "#e69138", icon: "S" },
    { id: "marker", label: "Marker", color: "#a64d79", icon: "M" },
  ],
  initialPieces: [
    { id: "scout-1", typeId: "scout", position: { x: 0, y: 0 } },
    { id: "marker-1", typeId: "marker", position: { x: 4, y: 0 } },
  ],
};

export default meadowV1;
