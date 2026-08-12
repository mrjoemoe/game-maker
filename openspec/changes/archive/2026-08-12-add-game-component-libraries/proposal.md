## Why

The current template/prototype model centralizes runtime code, but each prototype still owns a monolithic game definition, so reusable tiles, pieces, items, rules, board generators, and behaviors are difficult to move between game variants and drift when copied. A composable game-parts library is needed so variants can share canonical components and automatically receive compatible updates while retaining explicit, reviewable variant-specific overrides.

## What Changes

- Add a repository-level game-parts library with stable component identifiers, typed manifests, ownership metadata, documentation, and validation.
- Define variants as composition manifests that select reusable components and add narrowly scoped local configuration or extensions.
- Resolve each variant from its component dependencies at build/development time instead of copying component source into the variant.
- Make unpinned component references follow the canonical library version so an update is reflected in every consuming variant; permit explicit version pins for controlled experiments and breaking migrations.
- Add dependency tracing, compatibility checks, cycle detection, and impact reporting so developers can see which variants consume a component before accepting a change.
- Introduce component lifecycle and migration rules for additive, breaking, renamed, and retired components.
- Replace the template-first scaffolding workflow with variant and component workflows, while preserving the shared engine/web runtime.
- Integrate library maintenance into repository operating guidance and Cursor skills so game development updates the canonical component when shared behavior is intended, updates variant-local composition when it is not, validates all affected variants, and keeps component metadata and docs current.
- Migrate existing prototype definitions incrementally, beginning with shared tile-board concepts and retaining compatibility until all active prototypes use composition manifests.
- Separate Goblin Woods gameplay requirements from the generic template/prototype capability so variant rules and reusable component contracts have clear owners.

## Capabilities

### New Capabilities

- `game-component-library`: Defines canonical reusable game parts, component identity and contracts, composition, dependency resolution, update propagation, compatibility controls, validation, and impact analysis.
- `goblin-woods-variant`: Owns Goblin Woods-specific gameplay requirements that are currently mixed into the generic template/prototype model.

### Modified Capabilities

- `template-prototype-model`: Reframes named prototypes as composed game variants, defines how variants consume shared components, and deprecates templates as the primary reuse/scaffolding abstraction.
- `agent-operating-rules`: Requires agents and skills to classify changes as shared-component or variant-local work, maintain the library during development, and verify every affected variant.

## Impact

- New library manifests, component source locations, composition schemas, resolver/validator tooling, and tests.
- Changes to prototype configs, prototype registry/loading, engine/web type boundaries, development commands, and repository documentation.
- Updates to `AGENT.md`, `prototype-from-template`, OpenSpec planning/apply/fast-track skills, and new component/variant authoring skills.
- Migration of `meadow-v1`, `quiet-glade`, and `goblin-woods` from monolithic definitions toward composed variants.
- Relocation of existing Goblin Woods requirements without changing their gameplay behavior.
- No immediate runtime fork: `@game-maker/engine` and `@game-maker/web` remain shared packages.
