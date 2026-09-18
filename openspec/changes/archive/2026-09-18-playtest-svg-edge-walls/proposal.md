## Why

Per-tile CSS wall bars double-draw at corners, sit in the grid gap with negative offsets, and overlap tile badges. Playtesting needs one crisp stroke per shared edge.

## What Changes

- Draw every edge wall as a single board-level SVG segment (round caps, non-scaling stroke)
- Stop rendering wall bars inside each `TileView`
- Keep walls visible on face-down tiles; one segment per shared edge

## Impact

- Capability: `playtest-web-app`, `board-engine-core` (segment parse helper)
- Engine: modified (parse/list wall segments for rendering)
- Components: none
- Variants: reused (Goblin Woods walls unchanged)
