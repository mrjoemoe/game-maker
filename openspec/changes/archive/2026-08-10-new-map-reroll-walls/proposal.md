## Why

“New map” currently full-resets from the game definition, which uses a fixed side-wall seed, so every map looks the same.

## What Changes

- In run mode, full reset / New map re-rolls the side-wall seed so wall layouts differ between maps.
- Soft reset (“Try again”) still keeps the current map.

## Impact

- `board-engine-core`: run-mode reset reseeds side walls
- `playtest-web-app`: New map control produces a new wall layout
