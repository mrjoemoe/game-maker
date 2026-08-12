import type { CellOverride, RandomTilePlacement } from "@game-maker/engine";
import { defineComponent } from "../../authoring.js";

const WIDTH = 7;
const HEIGHT = 7;
const START = { x: 3, y: 6 } as const;
const CORNERS = [
  { x: 0, y: 0 },
  { x: WIDTH - 1, y: 0 },
  { x: 0, y: HEIGHT - 1 },
  { x: WIDTH - 1, y: HEIGHT - 1 },
] as const;
const RANDOM_EXCLUDE = [{ ...START }, ...CORNERS.map((c) => ({ ...c }))];

const overrides: CellOverride[] = [
  { coord: { ...START }, typeId: "mage" },
  { coord: { x: 0, y: 0 }, typeId: "extraction" },
  { coord: { x: WIDTH - 1, y: 0 }, typeId: "extraction" },
  { coord: { x: 0, y: HEIGHT - 1 }, typeId: "extraction" },
  { coord: { x: WIDTH - 1, y: HEIGHT - 1 }, typeId: "extraction" },
];

const randomPlacements: RandomTilePlacement[] = [
  { typeId: "forest", count: 8, exclude: RANDOM_EXCLUDE },
  { typeId: "shop", count: 3, exclude: RANDOM_EXCLUDE },
  { typeId: "portal-1", count: 1, exclude: RANDOM_EXCLUDE },
  { typeId: "portal-2", count: 1, exclude: RANDOM_EXCLUDE },
  { typeId: "portal-3", count: 1, exclude: RANDOM_EXCLUDE },
  { typeId: "portal-4", count: 1, exclude: RANDOM_EXCLUDE },
  { typeId: "thicket", count: 1, exclude: RANDOM_EXCLUDE },
  { typeId: "river", count: 1, exclude: RANDOM_EXCLUDE },
  { typeId: "pit", count: 2, exclude: RANDOM_EXCLUDE },
  { typeId: "snare", count: 1, exclude: RANDOM_EXCLUDE },
  { typeId: "goblin", count: 1, exclude: RANDOM_EXCLUDE },
  { typeId: "brute", count: 1, exclude: RANDOM_EXCLUDE },
  { typeId: "villain", count: 1, exclude: RANDOM_EXCLUDE },
      {
        typeId: "castle",
        count: 1,
        exclude: RANDOM_EXCLUDE,
      },
    ];

/**
 * Goblin Woods tile types + seeded layout. Depends on pass/reward items.
 */
export const boardsGoblinWoods = defineComponent({
  manifest: {
    id: "boards/goblin-woods",
    kind: "board",
    schemaVersion: 1,
    contractVersion: "1.0.0",
    owner: "goblin-woods",
    dependencies: [
      { id: "items/sword", range: "^1" },
      { id: "items/shield", range: "^1" },
      { id: "items/makeshift-bridge", range: "^1" },
      { id: "items/rope-bridge", range: "^1" },
      { id: "items/machete", range: "^1" },
      { id: "items/knife", range: "^1" },
      { id: "items/spear", range: "^1" },
      { id: "items/charm", range: "^1" },
      { id: "items/sneak", range: "^1" },
      { id: "items/sledgehammer", range: "^1" },
    ],
    docs: {
      summary:
        "Goblin Woods 7x7 board: Mage start, corner extraction, random content.",
      playerFacing:
        "Explore a hidden forest. Extract at corners. Open the walled castle with a sledgehammer.",
    },
  },
  contribute: () => ({
    board: {
      grid: { width: WIDTH, height: HEIGHT },
      tileTypes: [
        { id: "meadow", label: "Meadow", color: "#8fbc6b", effect: { kind: "empty" } },
        { id: "forest", label: "Forest", color: "#4f7a3e", effect: { kind: "empty" } },
        { id: "mage", label: "Mage", color: "#7b6b9e", effect: { kind: "mage" } },
        {
          id: "extraction",
          label: "Extraction",
          color: "#5a7a8c",
          effect: { kind: "extraction" },
        },
        { id: "shop", label: "Shop", color: "#c4a35a", effect: { kind: "shop" } },
        {
          id: "portal-1",
          label: "Portal 1",
          color: "#6b5b95",
          effect: { kind: "portal", portalId: 1 },
        },
        {
          id: "portal-2",
          label: "Portal 2",
          color: "#6b5b95",
          effect: { kind: "portal", portalId: 2 },
        },
        {
          id: "portal-3",
          label: "Portal 3",
          color: "#6b5b95",
          effect: { kind: "portal", portalId: 3 },
        },
        {
          id: "portal-4",
          label: "Portal 4",
          color: "#6b5b95",
          effect: { kind: "portal", portalId: 4 },
        },
        {
          id: "thicket",
          label: "Thicket",
          color: "#3d4f2f",
          effect: { kind: "wall" },
          passItemId: "machete",
        },
        {
          id: "river",
          label: "River",
          color: "#3d6f8c",
          effect: { kind: "wall" },
          passItemId: "rope-bridge",
        },
        {
          id: "pit",
          label: "Pit",
          color: "#5c4033",
          effect: { kind: "trap", damage: 35 },
          passItemId: "makeshift-bridge",
        },
        {
          id: "snare",
          label: "Snare",
          color: "#6b4423",
          effect: { kind: "trap", damage: 45 },
          passItemId: "knife",
        },
        {
          id: "goblin",
          label: "Goblin",
          color: "#6b8f3a",
          effect: { kind: "enemy", power: 2, damage: 40 },
          passItemId: "sword",
        },
        {
          id: "brute",
          label: "Brute",
          color: "#4a6b2a",
          effect: { kind: "enemy", power: 3, damage: 55 },
          passItemId: "spear",
        },
        {
          id: "villain",
          label: "Villain",
          color: "#2f4a1f",
          effect: {
            kind: "enemy",
            power: 4,
            damage: 70,
            rewardItemId: "shield",
          },
          passItemId: "charm",
        },
        {
          id: "castle",
          label: "Castle",
          color: "#8d6e4c",
          effect: { kind: "goal" },
          passItemId: "sledgehammer",
        },
      ],
      defaultTileTypeId: "meadow",
      edgeWalls: {
        count: 15,
        seed: 42,
      },
      coinWeights: { zero: 0.4, one: 0.3, two: 0.2, three: 0.1 },
      overrides,
      randomPlacements,
    },
  }),
});
