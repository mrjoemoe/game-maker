## 1. OpenSpec + agent guidance

- [x] 1.1 Update `openspec/config.yaml` with template/prototype context and archive→commit+push guidance
- [x] 1.2 Add root `AGENT.md`
- [x] 1.3 Add `.cursor/skills/prototype-from-template/SKILL.md`
- [x] 1.4 Add `.cursor/skills/archive-and-push/SKILL.md`

## 2. Template / prototype restructure

- [x] 2.1 Create `templates/tile-board/` metadata + docs; remove old `templates/base-game` package role
- [x] 2.2 Create `prototypes/meadow-v1/` config (from former base-game) with features + optional extensions pocket
- [x] 2.3 Add prototype registry and extend `GameDefinition` with templateId + features; enforce flip flag in engine + tests
- [x] 2.4 Update web app to load selected prototype and honor flip flag
- [x] 2.5 Update Docker Compose + `dev.sh` for `up <prototype> [port]` with isolated compose project names
- [x] 2.6 Update root README for the new workflow
