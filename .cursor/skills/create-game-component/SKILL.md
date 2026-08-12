---
name: create-game-component
description: >-
  Create or update a canonical game-library component with manifest, docs,
  tests, catalog registration, and consumer impact checks. Use when adding
  reusable tiles, pieces, items, rules, boards, or feature bundles.
---

# Create game component

## Steps

1. Search: `npm run game -- catalog search <query>` — reuse if a compatible component exists.
2. Choose granularity: cohesive player-facing concept; avoid one-consumer abstractions unless extracting for clarity during migration.
3. Add under `packages/game-library/src/components/<namespace>/`:
   - `defineComponent({ manifest, overrideAllowlist?, contribute })`
   - Stable id `namespace/name`, kind, `contractVersion`, deps, lifecycle, owner, docs
4. Register in `packages/game-library/src/components/index.ts` (`ALL_COMPONENTS`).
5. Additive compatible change → bump patch/minor on same major. Breaking → new major + migration notes; do not silently move `^oldMajor` consumers.
6. Contract tests in `packages/game-library` covering contribution shape and consumers.
7. Impact: `npm run game -- component consumers <id>` and `npm run game:check:changed`.
8. Update player-facing docs on the component and affected variant `RULEBOOK.md` files.

## Do not

- Copy component source into prototypes
- Depend on variant-local modules from a component
- Change public contracts without a version bump
