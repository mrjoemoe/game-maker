# Tile Board template

Reusable template for square-grid tile games with optional flip, pieces, reset, and run-based exploration.

## Runtime

Shared implementation lives in packages (do not copy these into each game):

- `@game-maker/engine` — headless board/game state
- `@game-maker/web` — React playtest shell

## Creating a game (prototype)

1. Copy `prototypes/meadow-v1` to `prototypes/<your-id>/` (or scaffold from the skill).
2. Edit `config/game.config.ts`:
   - `id` / `name` — prototype identity and display name
   - `templateId: "tile-board"`
   - `features.tileFlip` — enable/disable flipping
   - `features.runMode` — enable die-and-retry exploration (see below)
   - tile types, labels, colors, overrides, pieces
3. Optional: add unique logic under `extensions/` (see `extensions/README.md` in a prototype).
4. Register the prototype in `packages/web/src/prototypes/registry.ts`.
5. Launch: `./dev.sh up <your-id> [port]`

Do **not** fork `packages/web` or `packages/engine` for a normal new game version.

## Feature: tile flip

`features.tileFlip` (default `true`) lets players flip tiles face up/down. When `false`, flip actions are ignored and the flip UI is hidden.

## Feature: run mode

`features.runMode: true` turns the board into a learn-the-map / die-and-retry exploration game.

### Config

- `run: { heroPieceId, startPosition, maxHp, baseAttack }` — required when run mode is on
- `items?: ItemDefinition[]` — optional gear with `attackBonus` / `maxHpBonus`
- Tile types may declare an `effect`:
  - `{ kind: "empty" }` — meadow/forest (default)
  - `{ kind: "wall" }` — impassable; stepping reveals it but does not move
  - `{ kind: "trap"; damage }` — damages the hero every visit
  - `{ kind: "enemy"; power; damage; rewardItemId? }` — combat vs hero attack
  - `{ kind: "powerup"; itemId }` — grants an item once
  - `{ kind: "goal" }` — wins the run

### Loop

1. Map starts face-down except the start tile.
2. Player **steps** onto orthogonal neighbors; each step reveals and resolves the tile.
3. On HP ≤ 0 the run is **lost**; reaching a goal tile is **won**.
4. **softReset** ("Try again") respawns the hero, restores HP, reseeds inventory from discovered items, increments attempts, and respawns enemies — while keeping the revealed map and collected power-ups.
5. Full **reset** wipes everything back to the definition.
