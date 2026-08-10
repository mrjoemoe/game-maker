import { describe, expect, it } from "vitest";
import {
  createItemRegistry,
  resolveItem,
  totalAttack,
  totalMaxHp,
} from "./index.js";

const items = [
  { id: "sword", label: "Sword", attackBonus: 2 },
  { id: "shield", label: "Shield", maxHpBonus: 20 },
];

describe("items", () => {
  it("creates a registry and resolves items", () => {
    const registry = createItemRegistry(items);
    expect(resolveItem(registry, "sword").attackBonus).toBe(2);
  });

  it("rejects duplicate item ids", () => {
    expect(() =>
      createItemRegistry([
        { id: "sword", label: "A" },
        { id: "sword", label: "B" },
      ]),
    ).toThrow(/Duplicate item id/);
  });

  it("aggregates attack and max HP bonuses", () => {
    const registry = createItemRegistry(items);
    expect(totalAttack(registry, ["sword", "shield"], 1)).toBe(3);
    expect(totalMaxHp(registry, ["sword", "shield"], 100)).toBe(120);
  });

  it("ignores unknown inventory ids when aggregating", () => {
    const registry = createItemRegistry(items);
    expect(totalAttack(registry, ["missing"], 1)).toBe(1);
  });
});
