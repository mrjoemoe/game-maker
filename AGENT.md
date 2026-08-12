# AGENT.md — Game Maker operating model

This file is authoritative guidance for humans and agents working in this repo.

## Runtime / components / variants

| Layer | Path | Role |
|-------|------|------|
| **Runtime** | `packages/engine`, `packages/web` | Shared execution platform. Never fork for a normal new game. |
| **Components** | `packages/game-library` | Canonical reusable game parts (tiles, pieces, items, rules, boards, feature bundles). |
| **Variants** | `prototypes/<id>/` | Launchable game versions: composition manifests + optional `extensions/`. |

**Always create new games as composed variants**, not by copying another prototype’s full definition or forking packages.

### Decision tree (before editing)

1. **Shared behavior used (or intended) by more than one variant** → change or create a **canonical component** in `@game-maker/game-library`.
2. **Same components, different selection/parameters** → edit the **variant composition** (`defineVariant` / `use(...)`).
3. **Approved presentation/balance tweak on one variant** → explicit **override** on an allowlisted field.
4. **Truly one-off experiment** → variant `extensions/` with a `localReason`; promote to a component when a second consumer appears.

Copied component definitions across variants are forbidden. Prefer `npm run game -- catalog search <query>` before creating anything new.

### Scaffold / launch

1. Use `.cursor/skills/variant-from-library/` (not template copy).
2. Register in `packages/web/src/prototypes/registry.ts` and ensure Docker/`package.json` workspace wiring.
3. Launch: `./dev.sh up <id> [port]`.
4. Validate: `npm run game:check` (or `game:check:changed` after component edits).

`templates/tile-board/` is migration documentation only — not the reuse mechanism.

## OpenSpec is mandatory

**Every** behavior or product change MUST go through OpenSpec before (or as the first step of) implementation.

### Default: fast-track

**Default** for clear behavior changes: slim OpenSpec → implement → archive → commit+push (`.cursor/skills/openspec-fasttrack/SKILL.md`).

Record each affected game part as: reused | created | modified | pinned | migrated | deprecated | variant-local.

When changing a component, run impact analysis (`npm run game -- component consumers <id>` and `npm run game:check:changed`) and fix every affected variant before archive.

Use full propose only when the user asks to plan first or criteria are too ambiguous.

### After archive

Follow `.cursor/skills/archive-and-push/SKILL.md`: commit and **push to `origin`**, unless the user forbids it.

## Keep rulebooks current

Player-facing shared rule changes update **canonical component docs** and every affected variant `RULEBOOK.md` in the same change.

## Skills

- `.cursor/skills/openspec-fasttrack/` — default clear behavior changes
- `.cursor/skills/variant-from-library/` — scaffold a composed variant
- `.cursor/skills/create-game-component/` — add/update library components
- `.cursor/skills/prototype-from-template/` — redirect to variant-from-library
- `.cursor/skills/archive-and-push/` — after archive, commit and push
- `.cursor/skills/openspec-*` — propose / apply / archive / explore
