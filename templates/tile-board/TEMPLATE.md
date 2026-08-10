# Tile Board template

Reusable template for square-grid tile games with optional flip, pieces, and reset.

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
   - tile types, labels, colors, overrides, pieces
3. Optional: add unique logic under `extensions/` (see `extensions/README.md` in a prototype).
4. Register the prototype in `packages/web/src/prototypes/registry.ts`.
5. Launch: `./dev.sh up <your-id> [port]`

Do **not** fork `packages/web` or `packages/engine` for a normal new game version.
