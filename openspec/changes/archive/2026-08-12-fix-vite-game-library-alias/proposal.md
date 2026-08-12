## Why

Playtest Vite could not resolve `@game-maker/game-library`, so composed prototypes failed to load in Docker.

## What Changes

- Alias `@game-maker/game-library` to its TypeScript entry in the web Vite config (same pattern as `@game-maker/engine`).

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `playtest-web-app`: Vite must resolve the game-library package for composed prototypes.

## Impact

- `packages/web/vite.config.ts`
- Docker playtest launches for all composed prototypes
