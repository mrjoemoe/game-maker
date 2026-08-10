## Decisions

1. **Step = `{ action, move }`** — always resolve action on the current tile/context, then attempt the move.
2. **Actions** — `none` (just move), `takeFromMage` (must stand on unresolved Mage), `useItem` (must hold item; must match the upcoming move: passItemId on destination, or sledgehammer when that crossing is side-wall blocked).
3. **Auto-pass removed** — holding a pass item no longer bypasses hazards; `useItem` that step is required.
4. **Sledgehammer** — `breaksSideWalls: true`; clears walls on the edge being crossed, then moves. Using it when the crossing is open fails.
5. **Mage** — start position is Mage, face-up. Grant via programmed `takeFromMage` only. Remove `pendingItemChoice` / `chooseItem` / picker UI. Stepping onto a Mage is safe pass-through (no modal).
6. **Fail messages** — clear bump text when an action does not fit (e.g. “No Mage here to take from”, “Sledgehammer found no wall”, “Wrong item for that tile”).
