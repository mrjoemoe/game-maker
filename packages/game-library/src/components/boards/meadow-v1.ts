import { defineComponent } from "../../authoring.js";

export const boardsMeadowV1 = defineComponent({
  manifest: {
    id: "boards/meadow-v1",
    kind: "board",
    schemaVersion: 1,
    contractVersion: "1.0.0",
    owner: "meadow-v1",
    docs: {
      summary: "Meadow v1 board layout and tile types.",
    },
  },
  contribute: () => ({
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
  }),
});

export const piecesMeadowV1 = defineComponent({
  manifest: {
    id: "pieces/meadow-v1",
    kind: "piece",
    schemaVersion: 1,
    contractVersion: "1.0.0",
    owner: "meadow-v1",
    docs: { summary: "Meadow v1 scout and marker pieces." },
  },
  overrideAllowlist: ["label", "color", "icon", "piece.label", "piece.color"],
  contribute: () => ({
    pieceTypes: [
      { id: "scout", label: "Scout", color: "#e69138", icon: "S" },
      { id: "marker", label: "Marker", color: "#a64d79", icon: "M" },
    ],
    initialPieces: [
      { id: "scout-1", typeId: "scout", position: { x: 0, y: 0 } },
      { id: "marker-1", typeId: "marker", position: { x: 4, y: 0 } },
    ],
  }),
});
