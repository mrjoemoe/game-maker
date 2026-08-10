export type ItemDefinition = {
  id: string;
  label: string;
  icon?: string;
  /** Added to the hero's base attack while held. */
  attackBonus?: number;
  /** Added to the hero's base max HP while held. */
  maxHpBonus?: number;
  /** When used as a step action, clears side walls on the upcoming crossing. */
  breaksSideWalls?: boolean;
};

export type ItemRegistry = Record<string, ItemDefinition>;

export function createItemRegistry(items: ItemDefinition[]): ItemRegistry {
  const registry: ItemRegistry = {};
  for (const item of items) {
    if (registry[item.id]) {
      throw new Error(`Duplicate item id: ${item.id}`);
    }
    registry[item.id] = item;
  }
  return registry;
}

export function resolveItem(
  registry: ItemRegistry,
  itemId: string,
): ItemDefinition {
  const item = registry[itemId];
  if (!item) {
    throw new Error(`Unknown item id: ${itemId}`);
  }
  return item;
}

/** Effective attack = base + sum of held items' attack bonuses. */
export function totalAttack(
  registry: ItemRegistry,
  inventory: string[],
  baseAttack: number,
): number {
  return inventory.reduce(
    (attack, id) => attack + (registry[id]?.attackBonus ?? 0),
    baseAttack,
  );
}

/** Effective max HP = base + sum of held items' max-HP bonuses. */
export function totalMaxHp(
  registry: ItemRegistry,
  inventory: string[],
  baseMaxHp: number,
): number {
  return inventory.reduce(
    (maxHp, id) => maxHp + (registry[id]?.maxHpBonus ?? 0),
    baseMaxHp,
  );
}
