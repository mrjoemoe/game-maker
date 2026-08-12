import { defineComponent } from "../../authoring.js";

export const itemsSword = defineComponent({
  manifest: {
    id: "items/sword",
    kind: "item",
    schemaVersion: 1,
    contractVersion: "1.0.0",
    owner: "goblin-woods",
    docs: {
      summary: "Sword — attack bonus and goblin pass item.",
      playerFacing: "Sword (+2 attack). Also passes Goblin tiles.",
    },
  },
  overrideAllowlist: ["label", "icon", "item.label", "item.icon"],
  contribute: () => ({
    items: [{ id: "sword", label: "Sword", icon: "⚔️", attackBonus: 2 }],
  }),
});

export const itemsShield = defineComponent({
  manifest: {
    id: "items/shield",
    kind: "item",
    schemaVersion: 1,
    contractVersion: "1.0.0",
    owner: "goblin-woods",
    docs: { summary: "Shield — max HP bonus.", playerFacing: "Shield (+30 max HP)." },
  },
  contribute: () => ({
    items: [{ id: "shield", label: "Shield", icon: "🛡️", maxHpBonus: 30 }],
  }),
});

export const itemsMakeshiftBridge = defineComponent({
  manifest: {
    id: "items/makeshift-bridge",
    kind: "item",
    schemaVersion: 1,
    contractVersion: "1.0.0",
    owner: "goblin-woods",
    docs: { summary: "Pass item for pit tiles." },
  },
  contribute: () => ({
    items: [{ id: "makeshift-bridge", label: "Makeshift Bridge", icon: "🪵" }],
  }),
});

export const itemsRopeBridge = defineComponent({
  manifest: {
    id: "items/rope-bridge",
    kind: "item",
    schemaVersion: 1,
    contractVersion: "1.0.0",
    owner: "goblin-woods",
    docs: { summary: "Pass item for river tiles." },
  },
  contribute: () => ({
    items: [{ id: "rope-bridge", label: "Rope Bridge", icon: "🌉" }],
  }),
});

export const itemsMachete = defineComponent({
  manifest: {
    id: "items/machete",
    kind: "item",
    schemaVersion: 1,
    contractVersion: "1.0.0",
    owner: "goblin-woods",
    docs: { summary: "Pass item for thicket tiles." },
  },
  contribute: () => ({
    items: [{ id: "machete", label: "Machete", icon: "🪓" }],
  }),
});

export const itemsKnife = defineComponent({
  manifest: {
    id: "items/knife",
    kind: "item",
    schemaVersion: 1,
    contractVersion: "1.0.0",
    owner: "goblin-woods",
    docs: { summary: "Pass item for snare tiles." },
  },
  contribute: () => ({
    items: [{ id: "knife", label: "Knife", icon: "🔪" }],
  }),
});

export const itemsSpear = defineComponent({
  manifest: {
    id: "items/spear",
    kind: "item",
    schemaVersion: 1,
    contractVersion: "1.0.0",
    owner: "goblin-woods",
    docs: { summary: "Pass item for brute tiles." },
  },
  contribute: () => ({
    items: [{ id: "spear", label: "Spear", icon: "🔱" }],
  }),
});

export const itemsCharm = defineComponent({
  manifest: {
    id: "items/charm",
    kind: "item",
    schemaVersion: 1,
    contractVersion: "1.0.0",
    owner: "goblin-woods",
    docs: { summary: "Pass item for villain tiles." },
  },
  contribute: () => ({
    items: [{ id: "charm", label: "Charm", icon: "🔮" }],
  }),
});

export const itemsSneak = defineComponent({
  manifest: {
    id: "items/sneak",
    kind: "item",
    schemaVersion: 1,
    contractVersion: "1.0.0",
    owner: "goblin-woods",
    docs: { summary: "Sneak utility item." },
  },
  contribute: () => ({
    items: [{ id: "sneak", label: "Sneak", icon: "🥷" }],
  }),
});

export const itemsSledgehammer = defineComponent({
  manifest: {
    id: "items/sledgehammer",
    kind: "item",
    schemaVersion: 1,
    contractVersion: "1.0.0",
    owner: "goblin-woods",
    docs: {
      summary: "Breaks edge walls between tiles; castle pass item.",
      playerFacing:
        "Sledgehammer smashes the wall between two tiles and opens the castle.",
    },
  },
  contribute: () => ({
    items: [
      {
        id: "sledgehammer",
        label: "Sledgehammer",
        icon: "🔨",
        breaksSideWalls: true,
      },
    ],
  }),
});
