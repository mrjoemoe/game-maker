## Why

Playtesting hidden maps is slow without a way to peek at every tile. Debug reveal should show the full board, then hide again only tiles the player has not yet revealed through play.

## What Changes

- Add a Debug section in the playtest UI with a toggle to show all tiles
- While on, every tile displays as face-up
- While off, only tiles already face-up in game state (traversed/revealed) stay visible — unrevealed tiles hide again

## Impact

- Capability: `playtest-web-app`
- Engine: reused (display override; no permanent flip of unrevealed cells)
- Components: none
