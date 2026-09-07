## Why

Pruner currently deletes a whole timeline and its descendant forks. It should only cut a **loose** end: from the head down to the latest junction, and never a branch that is joined at both ends.

## What Changes

- Pruner only targets a tail that is free at the head (not merged).
- Cut from the head down to the latest fork, merge-in, or preserved card; that junction stays.
- A side branch with no internal junction is fully returned. Merged branches cannot be pruned.
- Play tab highlights only loose tails.

## Impact

- **modified:** timeline engine Pruner; playtest targeting; Timeline Game rulebook; `core/timeline` Pruner summary
- **reused:** Merger, Preserver, branch graph
