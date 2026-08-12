## Why

Per-tile side walls made blocking ambiguous (left wall vs approach from below) and could unfairly trap tiles. Walls should sit on edges between tiles, with a fixed count and a connected map.

## What Changes

- Replace per-cell `TileState.walls` generation with **edge walls** between adjacent cells.
- Place exactly **15** edge walls at random (seeded; New map re-rolls).
- Reject any placement that disconnects the grid (every cell remains reachable).
- Movement / sledgehammer / pass-item edge clearing operate on the single shared edge.
- Update Goblin Woods board component + rulebook; drop forced four-sided castle cell walls (castle still requires Sledgehammer as pass item — full enclosure would isolate the cell).
- Render edge walls in the playtest UI.

**Component disposition:** modified `boards/goblin-woods`, modified `items/sledgehammer` docs; variant-local rulebook.

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `board-engine-core`: edge-wall model, count, connectivity, blocking/clearing
- `playtest-web-app`: render between-tile walls
- `goblin-woods-variant`: 15 edge walls; castle enclosure requirement updated
- `game-component-library`: board component contributes edge-wall config

## Impact

- `packages/engine` board/tiles/game + tests
- `packages/web` TileView/BoardView/CSS
- `packages/game-library` goblin-woods board + docs
- `prototypes/goblin-woods/RULEBOOK.md`
