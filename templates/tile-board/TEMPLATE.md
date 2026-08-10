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

- `run: { heroPieceId, startPosition, maxHp, baseAttack, programLength? }` — required when run mode is on (`programLength` defaults to 6)
- `items?: ItemDefinition[]` — optional gear with `attackBonus` / `maxHpBonus`
- `board.sideWalls?` — optional random side-wall generation (`weights` for 0/1/2 walls per tile, `seed` for stability). Walls can face any of n/e/s/w; crossing a walled edge wastes the move.
- Tile types may declare an `effect`:
  - `{ kind: "empty" }` — meadow/forest (default)
  - `{ kind: "wall" }` — impassable; stepping reveals it but does not move
  - `{ kind: "trap"; damage }` — damages the hero every visit
  - `{ kind: "enemy"; power; damage; rewardItemId? }` — combat vs hero attack
  - `{ kind: "powerup"; itemId }` — grants an item once
  - `{ kind: "goal" }` — wins the run

### Loop

1. Map starts face-down except the start tile.
2. Player charts exactly `programLength` orthogonal moves (↑↓←→) in the path planner, then runs the program.
3. **Only meadow/forest (empty) tiles are safe.** Stepping onto a wall, trap, enemy, power-up, castle, or crossing a side wall ends the path as a loss, reports why (e.g. “You found a Castle — path over”), and stops remaining programmed moves.
4. **softReset** ("Try again") respawns the hero and restores HP while keeping the revealed map.
5. Full **reset** wipes everything back to the definition.
