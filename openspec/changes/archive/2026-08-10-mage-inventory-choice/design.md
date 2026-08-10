## Decisions

1. **New effect `mage`** — one-shot choice tile. Unresolved: step on it, stay playing, set `pendingItemChoice` to that cell. Resolved: behaves like empty (safe pass-through).
2. **`chooseItem` action** — grants the chosen id into inventory + `discoveredItemIds`, marks the Mage cell resolved, clears pending choice. Adjusts max HP when bonuses apply.
3. **Soft reset** — seeds inventory from `discoveredItemIds` (already); Mage stays resolved so the free pick is once per map. Full reset clears discoveries and Mage.
4. **Path execution** — stops when a choice is pending; player picks, then programs a new path from the Mage cell.
5. **UI** — dedicated sidebar Inventory panel (labels + icons). Mage picker modal lists all definition items. Trim redundant gear chips from the top RunHud to avoid duplication.
6. **Placement** — Goblin Woods Mage at `(3, 5)` directly north of start `(3, 6)`.
