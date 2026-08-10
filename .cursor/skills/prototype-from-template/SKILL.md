---
name: prototype-from-template
description: Scaffold a new board-game prototype from an existing template. Use when adding a new game version, forking a playtest config, or the user asks for a new prototype.
---

# Prototype from template

## Rule

New games are **prototypes** under `prototypes/<id>/`. Do **not** copy `packages/web`, `packages/engine`, or an entire template runtime for a normal new version.

## Steps

1. Confirm template id (default: `tile-board`). Read `templates/<id>/TEMPLATE.md`.
2. Create `prototypes/<id>/`:
   - `config/game.config.ts` — `GameDefinition` with `id`, `name`, `templateId`, `features` (e.g. `tileFlip`), board, pieces
   - `package.json` workspace package `@game-maker/prototype-<id>`
   - `extensions/index.ts` — optional hooks (`PrototypeExtensions`); may be empty
   - `README.md` — how to launch
3. Register in `packages/web/src/prototypes/registry.ts`.
4. Add the prototype `package.json` copy step to `docker/Dockerfile` if needed for `npm ci`.
5. Add workspace dependency on `@game-maker/web` if required; run `npm install`.
6. Verify: `./dev.sh up <id> [port]` and `npm run test` / typecheck.

## Config knobs (prefer these over custom code)

- Display name: `name`
- Tile type labels/colors/ids
- Grid size and per-cell overrides
- `features.tileFlip`
- Piece types and initial placement

Use `extensions/` only for behavior the template cannot express via config.
