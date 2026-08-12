## 1. Architecture Baseline

- [x] 1.1 Inventory reusable definitions and behavior in all active prototype configs, extensions, rulebooks, engine types, and web registry, recording proposed component ownership and real consumers.
- [x] 1.2 Run a TypeScript/Vite import spike comparing a root `game-parts/` content directory with `packages/game-library/src/components/`, then record the selected layout in the design.
- [x] 1.3 Select the first shared vertical slice from genuine `meadow-v1` and `quiet-glade` overlap and define component granularity rules from that example.
- [x] 1.4 Decide whether resolution reports are committed or generated-only and identify the repository check or CI entry point that will enforce affected-variant validation.
- [x] 1.5 Record the naming migration decision (`prototype` compatibility term versus final `variant` directory/API) while preserving stable launch ids.

## 2. Library Contracts and Package Setup

- [x] 2.1 Create the game-library workspace/package structure, exports, package scripts, Docker workspace copy/install integration, and TypeScript/Vitest configuration.
- [x] 2.2 Define typed component-kind, manifest, stable-id, schema-version, contract-version, compatibility-range, dependency, lifecycle, ownership, and documentation contracts.
- [x] 2.3 Define typed variant composition, component reference, parameter, explicit pin-with-reason, override, and variant-extension contracts.
- [x] 2.4 Define the resolved result contract containing `GameDefinition`, extensions, provenance, warnings, exact resolved versions, and dependency graph.
- [x] 2.5 Add contract tests that reject unsupported kinds, invalid ids, missing metadata, invalid compatibility ranges, and components that depend on variant-local content.

## 3. Catalog and Dependency Resolution

- [x] 3.1 Implement an explicit statically importable component catalog with lookup by stable id and retained major contract version.
- [x] 3.2 Implement deterministic dependency traversal and compatible-version selection for direct and transitive component references.
- [x] 3.3 Implement diagnostics for unknown components, incompatible ranges, missing dependencies, and complete dependency cycles.
- [x] 3.4 Implement active, deprecated, and retired lifecycle handling with replacement and migration guidance.
- [x] 3.5 Add catalog and graph tests covering successful transitive resolution, conflicting version ranges, cycles, deprecation warnings, retired-component errors, and retained-major pins.

## 4. Composition and Runtime Resolution

- [x] 4.1 Implement `defineComponent`, `defineVariant`, `use`, and explicit override authoring helpers with inferred TypeScript parameter types.
- [x] 4.2 Implement kind-specific contribution and deterministic merge policies for tile, piece, item, rule, board, feature-bundle, presentation, and extension components.
- [x] 4.3 Implement parameter-schema validation and field-level override allowlists, rejecting generic deep merges, undeclared shadowing, unknown override targets, and runtime-id collisions.
- [x] 4.4 Implement `resolveVariant` to produce the existing engine `GameDefinition` and extension contract with field-level provenance.
- [x] 4.5 Add resolver tests for component order, dependencies, parameters, approved overrides, collision errors, provenance, and complete runtime definitions.
- [x] 4.6 Add an integration test proving that changing one compatible canonical component changes two unpinned resolved variants without editing either manifest.
- [x] 4.7 Add an integration test proving that an exact pin retains its selected major and that an incompatible breaking major requires an explicit migration.

## 5. Migration Compatibility

- [x] 5.1 Implement a legacy adapter that wraps current monolithic `GameDefinition` exports as temporary variant sources and emits actionable migration warnings.
- [x] 5.2 Update the web prototype registry contract to accept variant manifests or legacy adapters and resolve both to the unchanged registered runtime shape.
- [x] 5.3 Verify existing ids, default selection, unknown-id diagnostics, and simultaneous launch on separate ports remain unchanged.
- [x] 5.4 Normalize prototype/variant workspace dependencies and static Vite registry imports so every registered game follows one documented package contract.
- [x] 5.5 Update template documentation to mark template scaffolding deprecated and direct developers to component-library composition without removing migration support.

## 6. First Shared Components and Simple Variants

- [x] 6.1 Implement the selected base tile-board component or feature bundle with manifest metadata, typed parameters, documentation, and contract tests.
- [x] 6.2 Extract the selected genuinely shared simple tile/piece concepts into canonical components without introducing speculative one-consumer abstractions.
- [x] 6.3 Convert `meadow-v1` to a thin composition manifest plus explicit local parameters/overrides and verify runtime parity.
- [x] 6.4 Convert `quiet-glade` to a thin composition manifest sharing the selected canonical components and verify runtime parity.
- [x] 6.5 Demonstrate consumer tracing and compatible update propagation across both converted variants in automated tests.

## 7. Goblin Woods Componentization

- [x] 7.1 Partition Goblin Woods into cohesive inventory, programmed-run, board-generation, terrain/hazard/enemy, extraction/shop/portal, presentation, and player-rule concepts, marking one-consumer concepts as local until reuse is justified.
- [x] 7.2 Extract reusable Goblin Woods item and rule components with complete dependency declarations, lifecycle metadata, docs, and tests.
- [x] 7.3 Extract reusable board-generation and tile feature bundles with deterministic parameter and merge contracts.
- [x] 7.4 Convert `goblin-woods` to a composition manifest while preserving map generation, items, run behavior, launch id, extensions, and rulebook behavior.
- [x] 7.5 Run engine, web, resolver, and Goblin Woods rule tests to verify parity and provenance after conversion.
- [x] 7.6 Relocate all Goblin Woods-specific requirements from `template-prototype-model` to `goblin-woods-variant`, preserving acceptance criteria and assigning shared behavior to component contracts.

## 8. Authoring and Impact Tooling

- [x] 8.1 Implement catalog list, show, and search commands that expose contracts, docs, lifecycle, dependencies, and direct/transitive consumers.
- [x] 8.2 Implement variant create, resolve, and graph commands that scaffold only a composition manifest and show exact versions and provenance.
- [x] 8.3 Implement component create, consumers, deprecate, and migration scaffolding commands that maintain catalog exports and required metadata/docs/tests.
- [x] 8.4 Implement `game check --changed` to map changed component files to ids, calculate affected variants, resolve them, and select component and variant checks.
- [x] 8.5 Implement a full catalog/variant validation command and wire changed/full checks into package scripts and the selected CI or completion gate.
- [x] 8.6 Add command tests for scaffolding, catalog maintenance, direct/transitive consumer reports, stale pins, and nonzero exits on affected-variant failures.

## 9. Agent and Skill Integration

- [x] 9.1 Update `AGENT.md` with the runtime/component/variant model and the decision tree for canonical component, variant composition, parameter/override, or variant extension changes.
- [x] 9.2 Add a `variant-from-library` skill that searches the catalog, creates a composition manifest, adds only missing reusable components, updates registry/Docker integration when needed, and validates the result.
- [x] 9.3 Add a `create-game-component` skill covering discovery, granularity, contracts, versions, dependencies, lifecycle, docs, tests, catalog registration, and consumer impact checks.
- [x] 9.4 Convert `prototype-from-template` into a migration redirect that forbids complete-definition copying and invokes the variant workflow.
- [x] 9.5 Update `openspec-propose` and `openspec-fasttrack` to inspect the catalog and record each affected game part as reused, created, modified, pinned, migrated, deprecated, or variant-local.
- [x] 9.6 Update `openspec-apply-change` so component code, manifest metadata, dependency declarations, versions, lifecycle, documentation, examples, and tests stay synchronized during implementation.
- [x] 9.7 Update fast-track and archive completion gates to run affected-variant checks and block completion on catalog, resolution, type-check, test, or rulebook failures.
- [x] 9.8 Update rulebook guidance so player-facing shared rule changes update canonical component documentation and every affected maintained variant rulebook.
- [x] 9.9 Add fixture-based or content tests for mandatory skill guidance and command invocations to detect future workflow drift.

## 10. Complete Migration and Remove Legacy Authoring

- [x] 10.1 Migrate every remaining active prototype to a composition manifest and verify no reusable definitions remain copied between variants.
- [x] 10.2 Add validation that rejects newly introduced monolithic prototype configs and copied canonical component source.
- [x] 10.3 Report and migrate stale exact pins or document approved time-boxed exceptions with owners and reasons.
- [x] 10.4 Remove the legacy adapter and template-first scaffold path after all registry entries resolve composition manifests.
- [x] 10.5 Update repository, prototype/variant, component, development, and migration documentation to describe the final operating model and commands.

## 11. Verification and Delivery

- [x] 11.1 Run strict OpenSpec validation, library and engine unit tests, web tests, type-checking, full catalog validation, and all affected-variant checks.
- [x] 11.2 Launch at least two composed variants simultaneously on separate ports and smoke-test selection, resolution, and visible shared-component updates.
- [x] 11.3 Verify a compatible shared update propagates, a pin remains stable, a breaking major is gated, a cycle fails clearly, and a failing consumer blocks completion.
- [x] 11.4 Archive the completed OpenSpec change so delta requirements merge into the main specifications.
- [x] 11.5 Follow the archive-and-push workflow to commit the implementation, archived change, and synchronized specs, then push unless the user explicitly forbids it.
