## Why

When charting a path, taking an item in an earlier step should let you program “Use” that item in a later step. The planner currently only unlocks Use for items already in the live inventory, so a first-step Mage take cannot be used later in the same plan.

## What Changes

- Path planner treats items granted by earlier queued `takeFromMage` steps as available for subsequent `useItem` actions in the same program.

## Impact

- `playtest-web-app`: PathPlanner projected inventory while composing
