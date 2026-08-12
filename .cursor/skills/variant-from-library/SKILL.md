---
name: variant-from-library
description: >-
  Scaffold a new board-game variant by composing canonical game-library
  components. Use when adding a new game version, spinning off a variant, or
  forking playtest composition (not copying full configs).
---

# Variant from library

## Rule

New games are **variants** under `prototypes/<id>/` composed from `@game-maker/game-library`. Do **not** copy another prototype’s complete `GameDefinition` or fork `packages/web` / `packages/engine`.

## Steps

1. Search the catalog: `npm run game -- catalog search <keywords>` and `catalog list`.
2. Create `prototypes/<id>/`:
   - Composition via `defineVariant` + `use("ns/name", "^1", params?)` (prefer exporting a manifest then `resolveVariant`)
   - `package.json` workspace package `@game-maker/prototype-<id>` depending on `@game-maker/game-library`
   - Optional `extensions/` only for truly local behavior (`localReason`)
   - `README.md` with launch command
3. Add missing **reusable** concepts with `.cursor/skills/create-game-component/` — do not inline shared parts into the variant.
4. Register in `packages/web/src/prototypes/registry.ts` using the manifest + `resolveVariant` path.
5. Add Dockerfile `COPY prototypes/<id>/package.json` and web workspace dependency if needed; `npm install`.
6. Validate: `npm run game -- variant resolve <id>`, `npm run game:check`, `npm run test` / `typecheck`.
7. Launch: `./dev.sh up <id> [port]`.

## Prefer params/overrides over forks

- Parameters on `use(...)` for supported customization
- Explicit allowlisted `override(...)` for presentation/balance
- New component version only for behavior differences meant to be shared or retained
