## Why

Edge walls currently only render on face-up tiles, so most of the 15 walls look missing. Players need to see every wall as a barrier between tiles.

## What Changes

- Always show all edge walls on the playtest board, including edges touching face-down tiles
- Draw each shared edge once, centered in the gap between the two cells

## Impact

- Capability: `playtest-web-app`
- Components: none (UI-only; board/edge-wall data reused)
