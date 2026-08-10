## Why

New map only re-rolls side walls and castle position while hazards, enemies, and forests stay fixed, so every map feels the same. New map must regenerate the playable layout.

## What Changes

- `randomPlacements` supports `count` to place multiple cells of a type from the map seed.
- Goblin Woods moves forests/hazards/enemies/caches onto seeded random placements (start Mage + extraction corners stay fixed).
- New map (full reset) keeps re-rolling `sideWalls.seed`, which drives walls and all random placements.

## Impact

- board createBoard, Goblin Woods config, specs
