## Why

After the initial run-mode ship, several playtest follow-ups were implemented without OpenSpec. This change retroactively records those behaviors and lands them in main specs so the repo matches what the game does.

## What Changes

- Path programming: chart N moves (default 6), then execute; stop early on path-over.
- Goblin Woods: 7×7 grid, start bottom-center, side-wall generation, tile tally UI.
- Side walls on tiles (0–2 sides); visible stone bars; crossing a wall ends the path.
- Only meadow/forest are safe; any other tile or wall ends the path with a reported reason.
- Path planner + Run HUD bump/lose messaging.

## Impact

Engine run/board/tiles, web playtest UI, goblin-woods prototype, tile-board template docs.
