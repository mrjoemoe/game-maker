## Why

Branch connectors still cut through cards when a fork spans occupied rows or extra columns. A detour around the whole timestream would be spaghetti; when a local path cannot miss tiles, the join should be a matching letter instead of a colliding line.

## What Changes

- Route fork/merge (and blocked stems) on orthogonal channels in the gutters and row gaps so strokes do not cross cards or mats.
- If no local path exists, end the wire with a letter badge and resume at the other card with the same letter.

## Impact

- **modified:** `playtest-web-app` (timeline canvas wires)
- **reused:** timeline engine graph
