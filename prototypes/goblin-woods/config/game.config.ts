import type { GameDefinition } from "@game-maker/engine";

/**
 * Goblin Woods — learn-the-map / die-and-retry forest run.
 *
 * Blind first runs usually fail on traps or underpowered goblin fights.
 * After a few deaths you know the walls, pits, and where the sword/shield
 * sit, then route around danger or come back geared for the castle.
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
    startPosition: { x: 0, y: 0 },
    maxHp: 100,
    baseAttack: 1,
  },
  board: {
    grid: { width: 6, height: 6 },
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
    overrides: [
      // Cosmetic forest patches
      { coord: { x: 1, y: 0 }, typeId: "forest" },
      { coord: { x: 3, y: 2 }, typeId: "forest" },
      { coord: { x: 4, y: 4 }, typeId: "forest" },
      { coord: { x: 0, y: 4 }, typeId: "forest" },

      // Walls blocking the obvious shortcuts
      { coord: { x: 2, y: 0 }, typeId: "thicket" },
      { coord: { x: 2, y: 1 }, typeId: "river" },

      // Traps on tempting paths
      { coord: { x: 1, y: 1 }, typeId: "pit" },
      { coord: { x: 3, y: 3 }, typeId: "snare" },

      // Enemies escalate toward the castle
      { coord: { x: 2, y: 2 }, typeId: "goblin" },
      { coord: { x: 4, y: 2 }, typeId: "brute" },
      { coord: { x: 4, y: 5 }, typeId: "villain" },

      // Gear off the main line — find on attempt 1, use on attempt 2+
      { coord: { x: 0, y: 3 }, typeId: "sword-cache" },
      { coord: { x: 5, y: 1 }, typeId: "shield-cache" },

      // Goal
      { coord: { x: 5, y: 5 }, typeId: "castle" },
    ],
  },
  pieceTypes: [{ id: "hero", label: "Hero", color: "#c47a2c", icon: "H" }],
  initialPieces: [{ id: "hero", typeId: "hero", position: { x: 0, y: 0 } }],
};

export default goblinWoods;
