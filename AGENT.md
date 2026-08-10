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

### Default: fast-track (not propose-and-stop)

**Default workflow** for clear behavior changes is **fast-track**: slim OpenSpec change → implement → archive (sync into main specs) → commit+push. Details: `.cursor/skills/openspec-fasttrack/SKILL.md`.

Use fast-track when the user describes what to build or fix with concrete enough rules — including multi-file engine + web + prototype work and “here’s the idea, make this update.” Touching several capabilities is **not** a reason to switch to full propose.

| Kind of change | Workflow |
|----------------|----------|
| Clear feature / rule / UI / prototype request (default) | **Fast-track** → implement → archive → commit+push |
| User explicitly asks to propose / plan first (`/opsx-propose`) | OpenSpec propose → stop; implement only when asked |
| Too ambiguous to implement without a design review gate | Clarify, or propose-then-wait; do not invent a long plan-only pause when criteria are already clear |

**Do not** open a full propose-and-stop cycle just because the change is “large” or spans `board-engine-core` + `playtest-web-app` + a prototype.

### After archive

Always follow `.cursor/skills/archive-and-push/SKILL.md`: commit the archived change, synced specs, and implementation, then **push to `origin`**, unless the user explicitly forbids commit or push.

### Exceptions

Only skip OpenSpec / archive / push when the user clearly says so in the same request (e.g. “skip openspec”, “code only”, “don’t push”).

## Keep the rulebook current

When a change alters **gameplay rules** for a prototype that has a `RULEBOOK.md` (e.g. `prototypes/goblin-woods/RULEBOOK.md`), **update that rulebook in the same change** so it matches shipped behavior. The playtest **Rulebook** tab reads this file — stale rules confuse playtests. Include rulebook edits in the OpenSpec tasks, archive, and commit.

## Skills

- `.cursor/skills/openspec-fasttrack/` — **default** for clear behavior changes: OpenSpec → implement → archive → commit+push
- `.cursor/skills/prototype-from-template/` — scaffold a new prototype
- `.cursor/skills/archive-and-push/` — after archive, commit and push
- `.cursor/skills/openspec-propose/` — plan-only; use only when asked to propose/plan first or blocked by ambiguity
- `.cursor/skills/openspec-*` — apply / archive / explore and related OpenSpec workflows
