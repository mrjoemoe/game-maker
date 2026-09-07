## Why

The Play tab player mat reused the canvas branch-mat class, so it collapsed into a 120px overlay with “None filed.” sitting on the piles.

## What Changes

- Player mat uses a distinct class and stays in the 2/3 lower column.
- Branch-mat styles apply only inside the timestream.

## Impact

- **modified:** playtest player-mat markup/CSS
- **reused:** `core/timeline`, device dock, facedown piles
