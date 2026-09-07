## Why

Merger currently starts a third “Confluence” timeline. A merge should end branch 1 and continue on branch 2, without a new branch.

## What Changes

- Incoming branch head gains a child edge to a node on the destination branch.
- Incoming branch is marked merged/closed. Destination keeps growing. No new node or branch.

## Impact

- **modified:** timeline engine Merger; `core/timeline` copy
- **modified:** `board-engine-core`, `playtest-web-app`, `timeline-game-variant`
- **reused:** branch graph, merge wires
