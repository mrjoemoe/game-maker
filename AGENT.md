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

## OpenSpec is mandatory

**Every** behavior or product change in this repo MUST go through OpenSpec before (or as the first step of) implementation. Do **not** jump straight to editing `packages/`, `prototypes/`, or `templates/` for feature work.

That includes “small” follow-ups such as:

- Path programming / grid / start-position tweaks
- Side walls, tile visuals, tallies, HUD copy
- Rule changes (e.g. path-over when leaving meadow/forest)
- Prototype config that changes gameplay

### Full vs fast-track

| Kind of change | Workflow |
|----------------|----------|
| Large / ambiguous / multi-capability | OpenSpec propose → apply → archive → commit+push |
| Minor / clear acceptance criteria | **Fast-track**: slim OpenSpec change → implement → archive (sync into main specs) → commit+push |

Fast-track details: `.cursor/skills/openspec-fasttrack/SKILL.md`.

### After archive

Always follow `.cursor/skills/archive-and-push/SKILL.md`: commit the archived change, synced specs, and implementation, then **push to `origin`**, unless the user explicitly forbids commit or push.

### Exceptions

Only skip OpenSpec / archive / push when the user clearly says so in the same request (e.g. “skip openspec”, “code only”, “don’t push”).

## Skills

- `.cursor/skills/openspec-fasttrack/` — minor changes: OpenSpec → implement → archive → commit+push
- `.cursor/skills/prototype-from-template/` — scaffold a new prototype
- `.cursor/skills/archive-and-push/` — after archive, commit and push
- `.cursor/skills/openspec-*` — full OpenSpec propose / apply / archive / explore workflows
