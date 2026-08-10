## Why

Extraction currently fires on step, so it cannot be charted as a deliberate program action. Players need to code Extract like Mage take, and the planner must stop after Extract because that step leaves the run.

## What Changes

- Add program action `extract` (must be standing on an extraction tile).
- Stepping onto extraction is safe only; banking happens only via `extract`.
- Path planner: Extract action available; after an Extract step is queued, no further steps can be added.

## Impact

- `board-engine-core`, `playtest-web-app`, engine program + step resolution, PathPlanner UI
