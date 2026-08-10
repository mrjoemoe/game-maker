## Why

The tile-board engine can flip tiles and move pieces, but it cannot express the "learn the map, die, retry" loop the research notes point to (Room 25 hidden grid, T.I.M.E Stories die-and-retry knowledge persistence, Robot Turtles crash-and-fix). To prototype a fantasy exploration game where a hero steps through a hidden forest, uncovers meadows/goblins/traps/power-ups/walls, fails, and retries with a learned map and found gear, the template needs a reusable run-based capability.

## What Changes

- Add optional tile **effects** (`empty`, `wall`, `trap`, `enemy`, `powerup`, `goal`) plus a per-cell `resolved` flag so one-shot effects fire once.
- Add an **items** registry (`attackBonus`, `maxHpBonus`) to `GameDefinition`.
- Add a **run state** (hp/maxHp/inventory/attempts/status) to `GameState`, plus a persistent `discoveredItemIds` list.
- Add a `features.runMode` flag and an optional `run` config (hero piece, start position, max HP, base attack).
- Add engine actions: `step` (move to an orthogonal neighbor, reveal the tile, resolve its effect) and `softReset` (respawn hero + reset HP while keeping the revealed map and discovered items).
- Update the web playtest shell to support run mode: step-to-move, an HP/inventory/attempts HUD, win/lose banner, tile effect icons, and a "Try again" (soft reset) control.
- Ship a new `goblin-woods` prototype using these mechanics.

## Capabilities

### Modified Capabilities
- `board-engine-core`: tile effects, items, run state, `step` and `softReset` actions, combat/trap/powerup/goal resolution.
- `template-prototype-model`: `runMode` feature flag and run/items config on prototype definitions.
- `playtest-web-app`: run-mode UI (step movement, run HUD, effect icons, try-again).

## Impact

- Extends `packages/engine` (new `items`/`run` modules; changes to `tiles` and `game`).
- Extends `packages/web` (`gameSession` store, `TileView`, new `RunHud`, `App`).
- Updates `templates/tile-board` docs/metadata.
- Adds `prototypes/goblin-woods/`, registers it, and updates `docker/Dockerfile`.
