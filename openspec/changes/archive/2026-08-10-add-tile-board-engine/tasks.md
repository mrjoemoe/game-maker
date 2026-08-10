## 1. Workspace scaffolding

- [x] 1.1 Convert root `package.json` to npm workspaces (`packages/*`, `templates/*`) and add shared TypeScript/Vitest tooling deps
- [x] 1.2 Scaffold `packages/engine` (package.json, tsconfig, vitest config, `src/` layout)
- [x] 1.3 Scaffold `packages/web` (Vite + React + TS app wiring to engine)
- [x] 1.4 Scaffold `templates/base-game` with a sample `GameDefinition` config and README

## 2. Engine core

- [x] 2.1 Implement grid layer (config, bounds, neighbors) with unit tests
- [x] 2.2 Implement tile types + tile state + flip with unit tests
- [x] 2.3 Implement board generation from config (default + overrides) with unit tests
- [x] 2.4 Implement pieces + movePiece (bounds-checked) with unit tests
- [x] 2.5 Implement GameDefinition, createInitialState, applyAction (flip/move/reset) with unit tests
- [x] 2.6 Export public API from `packages/engine/src/index.ts`

## 3. Docker dev environment

- [x] 3.1 Add `docker/Dockerfile`, `.dockerignore`, and root `docker-compose.yml` (web + test profile)
- [x] 3.2 Add `dev.sh` wrapper (`up`, `down`, `shell`, `test`, `build`)
- [x] 3.3 Document how to run the playtest app via Docker in root README

## 4. Playtest web UI

- [x] 4.1 Wire React store/reducer to engine actions
- [x] 4.2 Implement BoardView / TileView / PieceView (face-up vs face-down)
- [x] 4.3 Implement flip, select-and-move, and reset controls
- [x] 4.4 Load `templates/base-game` definition on startup

## 5. External assets

- [x] 5.1 Create `external/README.md`, `manifest.yaml`, `APPROVED.md` policy files
- [x] 5.2 Import and pin the Apache-2.0 `puzzle` skill under `external/skills/`; record digests in manifest
- [x] 5.3 Record tilemap-data-format and develop-web-game as pending-license candidates in APPROVED.md
- [x] 5.4 Add git submodules under `external/references/` for boardgame.io, headless-game-grid, tile-whitebox-editor, and tiled; record in manifest with read-only flags
