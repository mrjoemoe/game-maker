## Why

Fork and merge lines sit in a 4px gap and share the same thin gold stroke as same-branch stems, so new timelines do not read as separate branches.

## What Changes

- Draw same-branch stems, forks, and merges as distinct wire kinds.
- Route fork/merge wires through the gutter between columns (side exit) with a dark halo and a brighter, thicker stroke.

## Impact

- **modified:** `playtest-web-app` (timeline canvas wires)
- **reused:** timeline engine graph
