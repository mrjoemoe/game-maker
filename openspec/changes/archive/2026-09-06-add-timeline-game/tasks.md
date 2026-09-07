## 1. Engine

- [x] 1.1 Timeline graph, branch mats, player mat, seeded origin, movement, play-card append/fork, debug draws
- [x] 1.2 Devices A–H: Brancher, Reverser, Relocator, Pruner, Merger, Rewriter, Preserver, Jumper
- [x] 1.3 Objectives (claim / hold a turn), end-of-time hook, wire `timelineMode` into `GameDefinition` / `applyAction`
- [x] 1.4 Engine unit tests for seed, move, play, mats/crystals, and each device

## 2. Library and variant

- [x] 2.1 `core/timeline` with placeholder cards, eight devices, dummy board, traveler, docs
- [x] 2.2 `timeline-game` prototype, RULEBOOK, README, registry, Docker COPY, web workspace dependency
- [x] 2.3 Catalog CLI builtins + resolve/check tests

## 3. Playtest UI

- [x] 3.1 Play/Rulebook tabs; canvas with lanes, branch mats, traveler; player mat and hand
- [x] 3.2 Debug device dock A–H with targeting, plus draw/add-any-card
- [x] 3.3 Readable time-stream styling (forks, merges, preserve lock, end of time)

## 4. Verify

- [x] 4.1 `npx openspec validate add-timeline-game --strict`, `npm run test`, `npm run typecheck`, `npm run game:check`
- [x] 4.2 Browser-verify movement, all eight devices, Rulebook tab
