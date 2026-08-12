# Tile Board template (migration docs)

Reusable **runtime** for square-grid tile games lives in:

- `@game-maker/engine` — headless board/game state
- `@game-maker/web` — React playtest shell
- `@game-maker/game-library` — canonical components composed into variants

## Creating a game (variant)

**Do not copy a prototype config.** Use composition:

1. Follow `.cursor/skills/variant-from-library/SKILL.md`.
2. Select components (`core/tile-board`, boards, pieces, items, rules, …).
3. Author `defineVariant({ id, name, components: [use(...)] })`.
4. Register the manifest in `packages/web/src/prototypes/registry.ts`.
5. Launch: `./dev.sh up <your-id> [port]`.

Shared updates: change the component once; unpinned consumers pick it up on next resolve/check. Use `npm run game:check:changed` after edits.

## Feature notes

- `features.tileFlip` / `features.runMode` — usually via `core/tile-board` params or `rules/programmed-run`
- Tile effects, items, side walls, random placements — contribute through board/item/rule components
