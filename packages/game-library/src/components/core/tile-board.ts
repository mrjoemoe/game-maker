import { defineComponent } from "../../authoring.js";

/** Shared tile-board runtime binding used by all current variants. */
export const coreTileBoard = defineComponent({
  manifest: {
    id: "core/tile-board",
    kind: "feature-bundle",
    schemaVersion: 1,
    contractVersion: "1.0.0",
    owner: "platform",
    docs: {
      summary: "Binds a variant to the shared tile-board template runtime.",
      developerNotes:
        "Compatible updates to defaults propagate to every unpinned consumer.",
    },
  },
  contribute: ({ params }) => {
    const tileFlip =
      typeof params.tileFlip === "boolean" ? params.tileFlip : true;
    const runMode =
      typeof params.runMode === "boolean" ? params.runMode : false;
    return {
      templateId: "tile-board",
      features: { tileFlip, runMode },
    };
  },
});
