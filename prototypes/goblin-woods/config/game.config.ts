import type { GameDefinition } from "@game-maker/engine";

/**
 * Goblin Woods — chart a 6-move path through a hidden forest.
 * Start at the bottom center; castle waits near the top. Learn the map
 * across failed runs, then program smarter routes with found gear.
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
  ],
  run: {
    heroPieceId: "hero",
    startPosition: { x: 3, y: 6 },
    maxHp: 100,
    baseAttack: 1,
    programLength: 6,
  },
  board: {
    grid: { width: 7, height: 7 },
    tileTypes: [
      { id: "meadow", label: "Meadow", color: "#8fbc6b", effect: { kind: "empty" } },
      { id: "forest", label: "Forest", color: "#4f7a3e", effect: { kind: "empty" } },
      { id: "thicket", label: "Thicket", color: "#3d4f2f", effect: { kind: "wall" } },
      { id: "river", label: "River", color: "#3d6f8c", effect: { kind: "wall" } },
      {
        id: "pit",
        label: "Pit",
        color: "#5c4033",
        effect: { kind: "trap", damage: 35 },
      },
      {
        id: "snare",
        label: "Snare",
        color: "#6b4423",
        effect: { kind: "trap", damage: 45 },
      },
      {
        id: "goblin",
        label: "Goblin",
        color: "#6b8f3a",
        effect: { kind: "enemy", power: 2, damage: 40 },
      },
      {
        id: "brute",
        label: "Brute",
        color: "#4a6b2a",
        effect: { kind: "enemy", power: 3, damage: 55 },
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
      },
    ],
    defaultTileTypeId: "meadow",
    sideWalls: {
      seed: 42,
      weights: { none: 0.7, one: 0.25, two: 0.05 },
    },
    overrides: [
      // Cosmetic forest
      { coord: { x: 1, y: 5 }, typeId: "forest" },
      { coord: { x: 5, y: 5 }, typeId: "forest" },
      { coord: { x: 2, y: 3 }, typeId: "forest" },
      { coord: { x: 4, y: 2 }, typeId: "forest" },
      { coord: { x: 0, y: 1 }, typeId: "forest" },
      { coord: { x: 6, y: 1 }, typeId: "forest" },

      // Walls — block center lane shortcuts
      { coord: { x: 3, y: 4 }, typeId: "thicket" },
      { coord: { x: 3, y: 3 }, typeId: "river" },

      // Traps on tempting climbs
      { coord: { x: 2, y: 5 }, typeId: "pit" },
      { coord: { x: 4, y: 5 }, typeId: "snare" },
      { coord: { x: 1, y: 2 }, typeId: "pit" },

      // Enemies escalate toward the castle
      { coord: { x: 2, y: 4 }, typeId: "goblin" },
      { coord: { x: 4, y: 3 }, typeId: "brute" },
      { coord: { x: 3, y: 1 }, typeId: "villain" },

      // Gear off the main line
      { coord: { x: 0, y: 4 }, typeId: "sword-cache" },
      { coord: { x: 6, y: 3 }, typeId: "shield-cache" },

      // Goal near top center
      { coord: { x: 3, y: 0 }, typeId: "castle" },

      // Keep the starting meadow free of side walls so the first plan isn't blocked in place
      { coord: { x: 3, y: 6 }, walls: [] },
    ],
  },
  pieceTypes: [{ id: "hero", label: "Hero", color: "#c47a2c", icon: "H" }],
  initialPieces: [{ id: "hero", typeId: "hero", position: { x: 3, y: 6 } }],
};

export default goblinWoods;
