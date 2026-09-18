## Why

Tile-board playtest debug is only “reveal all tiles.” Iterating on maps needs coordinates, a tile inspector, and a way to walk or teleport the hero without filling the action track.

## What Changes

- Add a run-mode debug switch that unlocks designer tools
- Keep reveal-all; add coordinate overlay, last-clicked inspector, walk-now, and teleport
- Walk-now applies live `step` actions along the shortest walk; teleport uses `movePiece` and skips tile effects

## Impact

- Capability: `playtest-web-app`
- Engine: reused (`step`, `movePiece`)
- Components: none
