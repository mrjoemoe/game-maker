import type { GameDefinition } from "@game-maker/engine";

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

/**
 * Goblin Woods — chart a path through a hidden forest.
 * Stash gear by extracting at the corners; win the walled castle with a sledgehammer.
 * New map re-rolls the seed so walls and content placements change.
 */
export const goblinWoods: GameDefinition = {
  id: "goblin-woods",
  name: "Goblin Woods",
  templateId: "tile-board",
  features: {
    tileFlip: false,
    runMode: true,
  },
  items: [
    { id: "sword", label: "Sword", icon: "⚔️", attackBonus: 2 },
    { id: "shield", label: "Shield", icon: "🛡️", maxHpBonus: 30 },
    { id: "makeshift-bridge", label: "Makeshift Bridge", icon: "🪵" },
    { id: "rope-bridge", label: "Rope Bridge", icon: "🌉" },
    { id: "machete", label: "Machete", icon: "🪓" },
    { id: "knife", label: "Knife", icon: "🔪" },
    { id: "spear", label: "Spear", icon: "🔱" },
    { id: "charm", label: "Charm", icon: "🔮" },
    { id: "sneak", label: "Sneak", icon: "🥷" },
    {
      id: "sledgehammer",
      label: "Sledgehammer",
      icon: "🔨",
      breaksSideWalls: true,
    },
  ],
  run: {
    heroPieceId: "hero",
    startPosition: { ...START },
    maxHp: 100,
    baseAttack: 1,
    programLength: 6,
  },
  board: {
    grid: { width: WIDTH, height: HEIGHT },
    tileTypes: [
      { id: "meadow", label: "Meadow", color: "#8fbc6b", effect: { kind: "empty" } },
      { id: "forest", label: "Forest", color: "#4f7a3e", effect: { kind: "empty" } },
      {
        id: "mage",
        label: "Mage",
        color: "#7b6b9e",
        effect: { kind: "mage" },
      },
      {
        id: "extraction",
        label: "Extraction",
        color: "#5a7a8c",
        effect: { kind: "extraction" },
      },
      {
        id: "shop",
        label: "Shop",
        color: "#c4a35a",
        effect: { kind: "shop" },
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
        id: "sword-cache",
        label: "Sword Cache",
        color: "#b0a090",
        effect: { kind: "powerup", itemId: "sword" },
      },
      {
        id: "shield-cache",
        label: "Shield Cache",
        color: "#9aa8b0",
        effect: { kind: "powerup", itemId: "shield" },
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
    sideWalls: {
      seed: 42,
      weights: { none: 0.7, one: 0.25, two: 0.05 },
    },
    coinWeights: { zero: 0.4, one: 0.3, two: 0.2, three: 0.1 },
    overrides: [
      // Fixed anchors only — everything else is seeded random on New map.
      { coord: { ...START }, typeId: "mage", walls: [] },
      { coord: { x: 0, y: 0 }, typeId: "extraction", walls: [] },
      { coord: { x: WIDTH - 1, y: 0 }, typeId: "extraction", walls: [] },
      { coord: { x: 0, y: HEIGHT - 1 }, typeId: "extraction", walls: [] },
      { coord: { x: WIDTH - 1, y: HEIGHT - 1 }, typeId: "extraction", walls: [] },
    ],
    randomPlacements: [
      { typeId: "forest", count: 6, exclude: RANDOM_EXCLUDE },
      { typeId: "shop", count: 3, exclude: RANDOM_EXCLUDE },
      { typeId: "thicket", count: 1, exclude: RANDOM_EXCLUDE },
      { typeId: "river", count: 1, exclude: RANDOM_EXCLUDE },
      { typeId: "pit", count: 2, exclude: RANDOM_EXCLUDE },
      { typeId: "snare", count: 1, exclude: RANDOM_EXCLUDE },
      { typeId: "goblin", count: 1, exclude: RANDOM_EXCLUDE },
      { typeId: "brute", count: 1, exclude: RANDOM_EXCLUDE },
      { typeId: "villain", count: 1, exclude: RANDOM_EXCLUDE },
      { typeId: "sword-cache", count: 1, exclude: RANDOM_EXCLUDE },
      { typeId: "shield-cache", count: 1, exclude: RANDOM_EXCLUDE },
      {
        typeId: "castle",
        count: 1,
        exclude: RANDOM_EXCLUDE,
        walls: ["n", "e", "s", "w"],
      },
    ],
  },
  pieceTypes: [{ id: "hero", label: "Hero", color: "#c47a2c", icon: "H" }],
  initialPieces: [{ id: "hero", typeId: "hero", position: { ...START } }],
};

export default goblinWoods;
