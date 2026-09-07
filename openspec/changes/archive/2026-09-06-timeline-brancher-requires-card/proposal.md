## Why

Brancher currently drops an empty “Open rift” tile. A new timeline should start with a real action card the player chooses from hand.

## What Changes

- Brancher requires a fork node **and** an action card from hand; that card is the first card on the new branch.
- Stop creating or labeling Open rift tiles. Epoch stays Origin; Merger’s empty join is a Confluence, not a rift.

## Impact

- **modified:** timeline engine Brancher action; `core/timeline` device copy
- **modified:** `board-engine-core`, `playtest-web-app`, `timeline-game-variant`
- **reused:** `createFork` when playing a card off a mid-timeline node
