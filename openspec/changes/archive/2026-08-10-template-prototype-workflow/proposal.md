## Why

Game configs currently live under `templates/`, which blurs "reusable template source" with "a playable game instance." Agents and humans need a clear split: templates own shared source/behavior; prototypes are named game versions driven by config (and optional special code), runnable side-by-side.

## What Changes

- Treat `templates/` as template source/docs (starting with `tile-board`); move playable game definitions into `prototypes/<name>/`.
- Extend game config with template id, display name, feature flags (e.g. tile flip enabled/disabled), and an optional `extensions/` hook for prototype-unique code.
- Launch playtest via `./dev.sh up <prototype> [port]` so multiple prototypes can run simultaneously on different ports.
- Add `AGENT.md` plus Cursor skills for prototype-from-template workflow and archive-then-commit-and-push.
- Update OpenSpec project context/guidance to encode this operating model.

## Capabilities

### New Capabilities
- `template-prototype-model`: Templates vs prototypes folder contract, config-driven game versions, optional extensions, multi-instance launch.
- `agent-operating-rules`: AGENT.md and skills that instruct agents how to create games and how to archive (including commit+push).

### Modified Capabilities
- `playtest-web-app`: Load active prototype by launch config (not a hard-coded template package); honor feature flags such as tile flip.
- `docker-dev-environment`: Wrapper/Compose support for selecting prototype id and host port.
- `board-engine-core`: Feature-aware flip (reject or no-op when flip disabled in definition).

## Impact

- Moves `templates/base-game` content into `prototypes/` (e.g. `meadow-v1`).
- Updates web entry, Docker compose volumes/env, `dev.sh`, README, and OpenSpec config.
- Adds `.cursor/skills/` and root `AGENT.md`.
