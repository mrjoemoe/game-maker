## Why

Players should be able to commit and run a shorter path (1–N steps) instead of always filling all `programLength` slots.

## What Changes

- Engine accepts programs with 1..`programLength` steps (rejects empty or over-long).
- Path planner enables Run path once at least one step is queued.

## Impact

- `board-engine-core`: program length validation
- `playtest-web-app`: Run path enabled for partial programs
