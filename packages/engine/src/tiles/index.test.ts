import { describe, expect, it } from "vitest";
import {
  createTileState,
  createTileTypeRegistry,
  flipTileState,
  resolveTileType,
} from "./index.js";

describe("tiles", () => {
  const registry = createTileTypeRegistry([
    { id: "grass", label: "Grass", color: "#4caf50" },
    { id: "water", label: "Water", color: "#2196f3" },
  ]);

  it("resolves a registered tile type by id", () => {
    expect(resolveTileType(registry, "water").label).toBe("Water");
  });

  it("flips face-down to face-up and back", () => {
    let tile = createTileState("grass", false);
    tile = flipTileState(tile);
    expect(tile.isFaceUp).toBe(true);
    tile = flipTileState(tile);
    expect(tile.isFaceUp).toBe(false);
  });
});
