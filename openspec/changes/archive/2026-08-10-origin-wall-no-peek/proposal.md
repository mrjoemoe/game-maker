## Why

Bumping into a side wall on your current tile was still revealing the destination, which lets you “see through” the wall. That breaks the information rules of the path-planning game.

## What Changes

- If the exit side of the current tile is walled, the run ends without revealing the destination.
- Destination is still revealed when the block is only on the next tile’s entry side.
- `useItem` must not reveal the destination before checking an origin-side wall (and sledgehammer failures must not peek).

## Impact

- `board-engine-core`: side-wall bump reveal rules
