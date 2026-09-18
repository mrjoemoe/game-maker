## Why

Run mode ignored board clicks, so moving meant hunting directional buttons. Clicking a destination tile should chart the shortest orthogonal walk (around visible walls) onto the action track.

## What Changes

- Add engine shortest-walk helpers that respect edge walls and known solid-wall tiles
- Clicking a tile in run mode appends that walk as move actions, starting from the hero’s projected position after already-queued moves
- Truncate to remaining program slots; ignore clicks that cannot walk
- Document the click-to-chart shortcut in the Goblin Woods rulebook

## Impact

- Capability: `board-engine-core`, `playtest-web-app`, `goblin-woods-variant`
- Engine: modified (path helper)
- Components: `rules/programmed-run` reused (same program rules; new input method)
- Variants: Goblin Woods rulebook modified
