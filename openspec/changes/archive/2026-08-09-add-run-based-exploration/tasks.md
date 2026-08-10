## 1. Engine: tiles + items

- [x] 1.1 Add `TileEffect` union and `effect?` to `TileTypeDefinition`; add `resolved?` to `TileState` with helpers
- [x] 1.2 Add `items` module (`ItemDefinition`, registry, attack/maxHp aggregation) with unit tests

## 2. Engine: run state + game actions

- [x] 2.1 Add `run` module (`RunState`, `createRunState`, `applyDamage`, `collectItem`) with unit tests
- [x] 2.2 Extend `GameDefinition` (`features.runMode`, `run`, `items`) and `GameState` (`run`, `discoveredItemIds`)
- [x] 2.3 Implement `step` action (adjacency, wall reveal/block, reveal + effect resolution, combat)
- [x] 2.4 Implement `softReset` action (respawn + HP reset, keep map + discovered items, reset enemies)
- [x] 2.5 Extend `game` unit tests for step/softReset/combat/trap/powerup/goal
- [x] 2.6 Update `packages/engine/src/index.ts` exports

## 3. Template docs

- [x] 3.1 Document `runMode` mechanics in `templates/tile-board/TEMPLATE.md`
- [x] 3.2 Add `runMode` + `run`/`items` to `templates/tile-board/template.json` config schema

## 4. Web playtest UI

- [x] 4.1 Extend `gameSession` store for run mode (step on neighbor click, softReset action)
- [x] 4.2 Add `RunHud` component (HP bar, items, attempts, win/lose banner, try-again)
- [x] 4.3 Extend `TileView` with effect icons and resolved styling
- [x] 4.4 Wire run mode into `App.tsx` (arrow keys, hide free move/flip when runMode)

## 5. Prototype: goblin-woods

- [x] 5.1 Add `prototypes/goblin-woods/config/game.config.ts` (hand-authored learnable map)
- [x] 5.2 Add `extensions/index.ts`, `package.json`, `README.md`
- [x] 5.3 Register in `packages/web/src/prototypes/registry.ts`
- [x] 5.4 Add prototype package copy to `docker/Dockerfile`

## 6. Verify

- [x] 6.1 `npm run test` and `npm run typecheck` pass
- [x] 6.2 Playtest `./dev.sh up goblin-woods`
