## 1. Engine edge model

- [x] 1.1 Add edge-wall types, keys, blocking, clear, and connected generation (count + seed)
- [x] 1.2 Wire `Board` / `BoardConfig` to `edgeWalls`; stop generating per-cell `TileState.walls`
- [x] 1.3 Update movement, sledgehammer, and pass-item clearing to use shared edges
- [x] 1.4 Update New map seed reroll for edge walls
- [x] 1.5 Update engine tests

## 2. Library + Goblin Woods

- [x] 2.1 Update `boards/goblin-woods` to `edgeWalls: { count: 15 }` and drop castle cell wall override
- [x] 2.2 Update sledgehammer/component docs and RULEBOOK.md
- [x] 2.3 Run `game:check` / library tests

## 3. Playtest UI

- [x] 3.1 Render shared edge walls on the board
- [x] 3.2 Typecheck web

## 4. Ship

- [x] 4.1 Archive specs into main, commit, and push
