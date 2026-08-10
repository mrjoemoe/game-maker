# AGENT.md — Game Maker operating model

This file is authoritative guidance for humans and agents working in this repo.

## Templates vs prototypes

| Layer | Path | Role |
|-------|------|------|
| **Template** | `templates/<template-id>/` | Reusable product shape + docs. Shared runtime stays in `packages/engine` and `packages/web`. |
| **Prototype** | `prototypes/<prototype-id>/` | A **named game version**: config (tile names, grid, features like flip) + optional `extensions/` for unique code. |

**Always create new games as prototypes**, not by forking template/runtime source.

1. Start from an existing prototype or `templates/tile-board/TEMPLATE.md`.
2. Add `prototypes/<id>/config/game.config.ts` with `templateId`, `name`, `features`, tiles, pieces.
3. Optionally add `extensions/` for special one-off behavior.
4. Register the prototype in `packages/web/src/prototypes/registry.ts`.
5. Launch with `./dev.sh up <id> [port]` (different ports = simultaneous playtests).

## OpenSpec

Use OpenSpec for planning/implementation (`openspec` / Cursor OpenSpec skills). After archiving a change, follow `.cursor/skills/archive-and-push/SKILL.md` (commit + push unless the user forbids push).

## Skills

- `.cursor/skills/prototype-from-template/` — scaffold a new prototype
- `.cursor/skills/archive-and-push/` — archive then commit and push
- `.cursor/skills/openspec-*` — OpenSpec workflows
