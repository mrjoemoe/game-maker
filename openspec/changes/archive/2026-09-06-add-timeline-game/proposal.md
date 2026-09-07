## Why

The designer wants a new game, Timeline Game: a time traveler fixing the past by building branching timelines. First player to complete 3 person–place–thing objectives wins. The shared tile-board runtime cannot express branch mats, devices, or walking through time.

## What Changes

- Headless timeline engine: epoch-rooted DAG, traveler movement, action/random placement, player mat (parts, minerals, crystals, 3 device slots, blueprints), branch mats (society + crystals), objectives, end-of-time.
- Eight devices: Brancher, Reverser, Relocator, Pruner, Merger, Rewriter, Preserver, Jumper.
- Debug mode (default on) skips costs, hand limits, blueprints, and branch-length rules so the designer can move, draw, play, and fire any device.
- `core/timeline` (created) + variant `timeline-game` (created) with Play and Rulebook tabs.

## Impact

- **created:** `core/timeline` — template, dummy board, traveler, placeholder cards/devices
- **created:** variant `timeline-game`
- **modified:** `board-engine-core`, `playtest-web-app`, `template-prototype-model`, `game-component-library`
- **reused:** Play/Rulebook tab shell
- **not used:** Goblin Woods run/path components
