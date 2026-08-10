## Context

See proposal.md. Builds on the existing npm workspaces + Docker playtest stack from `add-tile-board-engine`.

## Goals / Non-Goals

**Goals:**
- Clear templates vs prototypes separation
- Config-driven naming/features; optional extensions pocket
- Multi-prototype Docker launch
- Durable agent rules (AGENT.md + skills + OpenSpec config)

**Non-Goals:**
- Full plugin runtime for extensions (v1: reserved folder + typed optional export)
- Visual prototype picker UI
- Publishing templates as separate npm packages

## Decisions

### 1. Folder contract
- `templates/tile-board/` — template docs + metadata (`template.json`); shared implementation remains `packages/engine` + `packages/web` (the tile-board template's runtime).
- `prototypes/<id>/` — `config/game.config.ts`, optional `extensions/`, README.
- **Why:** Avoids duplicating React/Vite per game while still treating templates as first-class and prototypes as named launches.
- **Alternatives:** Copy entire web app per prototype (rejected — diverges fast).

### 2. Launch via env
- `VITE_PROTOTYPE` + `HOST_PORT` / compose port mapping; `./dev.sh up <prototype> [port]`.
- Web resolves definition through a small prototype registry module that imports known prototypes (Vite-friendly) and selects by id.
- **Why:** Vite needs static-analyzable imports; registry grows as prototypes are added.
- **Alternatives:** Fully dynamic `import()` from arbitrary paths (fragile in Vite without glob).

### 3. Feature flags on GameDefinition
- `features: { tileFlip: boolean }` defaulting to `true` when omitted for back-compat.
- Engine `applyAction` no-ops flip when disabled; UI hides flip mode.

### 4. Extensions pocket
- `prototypes/<id>/extensions/index.ts` may export optional hooks (`PrototypeExtensions`); web imports via registry when present.
- v1 minimum: export type + empty/default; meadow-v1 can omit or export a stub comment module.

### 5. Agent guidance
- Root `AGENT.md`, skills `prototype-from-template` and `archive-and-push`, plus `openspec/config.yaml` context and `operations.archive.guidance`.

## Risks / Trade-offs

- [Prototype registry must be updated when adding games] → Document in skill + TEMPLATE.md; accept explicit registry entry as the scaffold step
- [Multiple compose projects on same default name] → `dev.sh` uses project name `gm-<prototype>` to isolate stacks

## Migration Plan

1. Move `templates/base-game` → `prototypes/meadow-v1`
2. Add `templates/tile-board` docs/metadata
3. Wire web/docker/dev.sh
4. Archive changes and commit/push per new skill

## Open Questions

None blocking.
