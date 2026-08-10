## Why

There is no local, configurable way to prototype tile-based board games in this repo. We need a layered engine (grid → tile types → tile state → pieces) plus a browser playtest UI, fully runnable in Docker so no host Node/library installs are required.

## What Changes

- Add a framework-agnostic TypeScript engine package with configurable grid size, tile-type registry, face-up/face-down tiles, pieces, and game-state actions (flip, move, reset).
- Add a React + Vite playtest web app that renders the board and supports click-to-flip tiles and click-to-move pieces.
- Add a `templates/base-game` config folder as the first swappable game definition for future variants.
- Add Docker-based dev/test workflow (`Dockerfile`, `docker-compose.yml`, `dev.sh`) so all npm/Node work happens in containers.
- Add an `external/` curation area: pinned agent skills plus git submodules under `external/references/` for browsing prior-art repos (boardgame.io, headless-game-grid, tile-whitebox-editor, tiled).

## Capabilities

### New Capabilities
- `board-engine-core`: Headless layered board engine — grid, tile types, tile state (including flip), board generation, pieces, and game-state actions.
- `playtest-web-app`: React UI to render and interactively playtest a game definition in the browser.
- `docker-dev-environment`: Containerized install/build/dev/test workflow with no required host Node installs.
- `external-asset-curation`: Policy and initial contents for `external/` (pinned skills + read-only reference submodules).

### Modified Capabilities

## Impact

- New npm workspaces under `packages/engine`, `packages/web`, and `templates/base-game`.
- New Docker files at repo root / `docker/`.
- New `external/` tree and `.gitmodules` entries for reference submodules.
- Root `package.json` becomes an npm workspaces root (OpenSpec CLI remains available).
- No existing application code to migrate (greenfield repo).
