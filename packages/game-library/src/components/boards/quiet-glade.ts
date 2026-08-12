import { defineComponent } from "../../authoring.js";

export const boardsQuietGlade = defineComponent({
  manifest: {
    id: "boards/quiet-glade",
    kind: "board",
    schemaVersion: 1,
    contractVersion: "1.0.0",
    owner: "quiet-glade",
    docs: { summary: "Quiet Glade board layout and tile types." },
  },
  contribute: () => ({
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
  }),
});

export const piecesQuietGlade = defineComponent({
  manifest: {
    id: "pieces/quiet-glade",
    kind: "piece",
    schemaVersion: 1,
    contractVersion: "1.0.0",
    owner: "quiet-glade",
    docs: { summary: "Quiet Glade walker piece." },
  },
  overrideAllowlist: ["label", "color", "icon"],
  contribute: () => ({
    pieceTypes: [
      { id: "walker", label: "Walker", color: "#6b4f3b", icon: "W" },
    ],
    initialPieces: [
      { id: "walker-1", typeId: "walker", position: { x: 0, y: 0 } },
    ],
  }),
});
