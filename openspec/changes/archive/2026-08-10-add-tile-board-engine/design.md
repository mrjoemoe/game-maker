## Context

Greenfield repo with OpenSpec CLI only. See proposal.md for motivation. Patterns borrowed from `~/agents` for Docker isolation and `external/` provenance, minus OpenClaw/Ollama/Tailscale.

## Goals / Non-Goals

**Goals:**
- Layered headless engine in TypeScript with no React dependency
- Thin React playtest shell over engine state
- Template-driven game definitions for future variants
- All Node/npm work via Docker
- Curated `external/` with pinned skill + browse-only reference submodules

**Non-Goals:**
- Hex grids, multiplayer, win conditions, occupancy/capture rules
- Visual tile map editor
- Using reference submodules as build inputs

## Decisions

### 1. npm workspaces monorepo
- **Choice:** Root workspaces: `packages/engine`, `packages/web`, `templates/base-game`
- **Why:** Clear package boundary between headless core and UI; templates can depend on engine types without duplicating code
- **Alternatives:** Single package (harder to keep UI out of engine); separate repos (overkill)

### 2. Engine state as pure functions / reducer
- **Choice:** `GameDefinition` (static config) + `createInitialState` + `applyAction` reducer for `flipTile`, `movePiece`, `reset`
- **Why:** Deterministic, easy to unit test, similar spirit to boardgame.io moves without adopting its multiplayer stack
- **Alternatives:** Mutable class instances; full boardgame.io dependency (too heavy for v1)

### 3. Web state wrapper
- **Choice:** React `useReducer` (or thin Context) calling engine `applyAction` — no Zustand for v1
- **Why:** Zero extra UI state library; engine already owns logic
- **Alternatives:** Zustand (fine later if UI grows); boardgame.io client

### 4. Square grid only, hand-rolled coords
- **Choice:** Implement width/height, bounds, 4-neighbors in-engine
- **Why:** Trivial for square grids; avoids unused hex deps
- **Alternatives:** honeycomb-grid (hex only); PathFinding.js (defer until needed)

### 5. Docker Node Alpine + Compose
- **Choice:** `node:22-alpine` image, `web` service for Vite HMR (bind-mount source), `test` profile for Vitest, `dev.sh` wrapper
- **Why:** Matches agents isolation goal without OpenClaw base image
- **Alternatives:** Host Node (rejected); full OpenClaw template (unnecessary)

### 6. External assets policy
- **Choice:** Mirror agents policy: README + manifest.yaml + APPROVED.md; pin `puzzle` SKILL.md files; add four reference **git submodules** under `external/references/` for browsing; flag tiled (GPL) and tile-whitebox-editor (license unverified) as read-only, no code copy into packages
- **Why:** User wants to browse prior art locally; submodules keep provenance without merging trees into the app
- **Alternatives:** Docs-only links (weaker for browsing); vendor full trees into packages (rejected)

### 7. Interaction model for playtest
- **Choice:** Mode or dual gesture: click empty/face area flips tile; click piece selects, second click moves; explicit Reset button. Prefer a small toolbar with Flip vs Move if click targets collide
- **Why:** Keeps v1 playable without drag-and-drop complexity
- **Alternatives:** Drag-and-drop only; separate edit/play modes (future)

## Risks / Trade-offs

- [Large submodule clone (especially tiled)] → Mitigate with shallow submodule clone (`--depth 1`) where practical; document `git submodule update --init`
- [GPL tiled browsable in-tree] → Manifest + README forbid copying into packages; no build dependency
- [tile-whitebox-editor license unclear] → Flag read-only; do not copy code
- [Click ambiguity between flip and piece select] → Toolbar mode or prioritize piece hit-target over flip

## Migration Plan

N/A (greenfield). Rollback = remove change branch / revert commit.

## Open Questions

None that block specs or tasks; piece occupancy and hex can be later changes.
