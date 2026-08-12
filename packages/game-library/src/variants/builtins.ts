import { defineVariant, override, use } from "../authoring.js";

export const meadowV1Variant = defineVariant({
  id: "meadow-v1",
  name: "Meadow v1",
  components: [
    use("core/tile-board", "^1", { tileFlip: true }),
    use("boards/meadow-v1", "^1"),
    use("pieces/meadow-v1", "^1"),
  ],
});

export const quietGladeVariant = defineVariant({
  id: "quiet-glade",
  name: "Quiet Glade",
  components: [
    use("core/tile-board", "^1", { tileFlip: false }),
    use("boards/quiet-glade", "^1"),
    use("pieces/quiet-glade", "^1"),
  ],
});

export const goblinWoodsVariant = defineVariant({
  id: "goblin-woods",
  name: "Goblin Woods",
  components: [
    use("core/tile-board", "^1", { tileFlip: false, runMode: true }),
    use("rules/programmed-run", "^1", {
      startPosition: { x: 3, y: 6 },
      maxHp: 100,
      baseAttack: 1,
      programLength: 10,
    }),
    use("boards/goblin-woods", "^1"),
  ],
});

export { override, use };
