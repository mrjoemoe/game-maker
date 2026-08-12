# Prototypes (variants)

Named launchable game versions composed from `@game-maker/game-library`.

- Composition manifest resolved to `GameDefinition` in `config/game.config.ts`
- Optional unique code: `extensions/`
- Register in `packages/web/src/prototypes/registry.ts`
- Launch: `./dev.sh up <prototype-id> [port]`
- Validate: `npm run game:check`

See root `AGENT.md` and `.cursor/skills/variant-from-library/`.
