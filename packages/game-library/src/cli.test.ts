import { describe, expect, it } from "vitest";
import { componentIdsFromPaths } from "./check.js";
import { createDefaultCatalog } from "./components/index.js";
import { findConsumers } from "./resolve.js";
import {
  goblinWoodsVariant,
  meadowV1Variant,
  quietGladeVariant,
} from "./variants/builtins.js";
import { checkChanged, checkFull } from "./check.js";

const variants = [meadowV1Variant, quietGladeVariant, goblinWoodsVariant];

describe("game CLI helpers", () => {
  it("maps changed paths to component ids", () => {
    expect(
      componentIdsFromPaths([
        "packages/game-library/src/components/core/tile-board.ts",
      ]),
    ).toContain("core/tile-board");
  });

  it("checkFull succeeds for builtin variants", () => {
    const result = checkFull(createDefaultCatalog(), variants);
    expect(result.ok).toBe(true);
  });

  it("checkChanged selects consumers of core/tile-board", () => {
    const result = checkChanged(createDefaultCatalog(), variants, [
      "packages/game-library/src/components/core/tile-board.ts",
    ]);
    expect(result.ok).toBe(true);
    expect(result.affectedVariants).toEqual([
      "goblin-woods",
      "meadow-v1",
      "quiet-glade",
    ]);
  });

  it("reports item consumers transitively via boards/goblin-woods", () => {
    const consumers = findConsumers(
      createDefaultCatalog(),
      "items/sword",
      variants,
    );
    expect(consumers).toEqual(["goblin-woods"]);
  });
});
