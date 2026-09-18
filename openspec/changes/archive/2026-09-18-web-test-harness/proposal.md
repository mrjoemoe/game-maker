## Why

Root `npm test` skipped the playtest web package, so session, click-to-queue, and debug helpers could regress unnoticed. Iteration needs those checks in the same command as engine tests.

## What Changes

- Add Vitest to `@game-maker/web` and include it in root `npm test`
- Cover `queueWalk`, `inspectCell`, `cellClicked`, and playtest routes
- Keep timeline layout/wire tests in the same runner

## Impact

- Capability: `playtest-web-app`
- Engine: reused
- Components: none
