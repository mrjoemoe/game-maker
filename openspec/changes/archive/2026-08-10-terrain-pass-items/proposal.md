## Why

Rough terrain (pits, rivers, enemies, castle, etc.) always ends the path today. Players need gear that lets them traverse specific hazards so route planning becomes item-aware.

## What Changes

- Tile types MAY declare an optional `passItemId` — the item that makes that tile traversable.
- Holding that item lets the hero step onto / through the tile instead of pathing over (goal with pass item wins).
- Goblin Woods defines pass items for every rough tile; sword/shield caches stay without pass items.
- Tile tally shows which item passes each listed tile type.

## Impact

- `board-engine-core`: pass-item traversal rules
- `playtest-web-app`: tally shows pass item
- `template-prototype-model` / Goblin Woods config: new items + `passItemId` wiring
