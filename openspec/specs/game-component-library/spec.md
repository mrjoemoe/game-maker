# game-component-library Specification

## Purpose

Defines canonical reusable game parts, composition, resolution, update propagation, and impact analysis.

## Requirements

### Requirement: Canonical game component library
The repository SHALL store reusable game parts in a canonical library under stable, globally unique component identifiers. Each component MUST declare its kind, schema version, public contract, dependencies, compatibility range, ownership metadata, and player/developer documentation.

#### Scenario: Shared tile is defined once
- **WHEN** multiple variants use the same tile definition
- **THEN** that tile has one canonical library definition referenced by the variants rather than copied definitions

#### Scenario: Unsupported component kind is rejected
- **WHEN** a library entry declares a kind that the component schema does not recognize
- **THEN** library validation fails with the component identifier and unsupported kind

### Requirement: Components are independently composable
The library SHALL support independently reusable data and behavior components, including tile types, piece types, items, rules, board setup or generation (including edge-wall count/seed), feature bundles, UI presentation metadata, and extension modules. A component MAY depend on other components through declared identifiers but MUST NOT depend on a consuming variant.

#### Scenario: Feature bundle brings dependencies
- **WHEN** a variant includes a feature bundle that declares item and rule dependencies
- **THEN** the resolver includes those dependencies in the resolved game definition

#### Scenario: Board contributes edge walls
- **WHEN** a board component declares `edgeWalls: { count: 15 }`
- **THEN** the resolved game definition includes that edge-wall configuration

#### Scenario: Component reaches into variant
- **WHEN** a component imports or references variant-local content not declared through its public contract
- **THEN** validation rejects the dependency

### Requirement: Variants resolve from composition manifests
Each game variant SHALL declare a composition manifest containing variant identity, selected component references, variant-local parameters, explicit overrides, and optional variant-only extensions. The resolver MUST produce the complete runtime game definition from that manifest before engine or web startup.

#### Scenario: Variant starts from components
- **WHEN** a valid composition manifest is selected for development
- **THEN** the resolver produces a complete definition consumable by the existing shared engine and web runtime

#### Scenario: Required component is missing
- **WHEN** a composition references an unknown component identifier
- **THEN** resolution fails before startup and identifies the missing reference and consuming variant

### Requirement: Shared updates propagate by default
An unpinned component reference SHALL resolve to the current canonical compatible component, so changing that component changes every consuming variant on its next validation, build, test, or development launch. Component source MUST NOT be materialized as copied source inside variants.

#### Scenario: Canonical component is updated
- **WHEN** a component's compatible canonical definition changes
- **THEN** every unpinned consuming variant resolves with the updated definition without editing its manifest

#### Scenario: Variant has a pin
- **WHEN** a variant explicitly pins a component version
- **THEN** that variant continues resolving the pinned version until its manifest is migrated

### Requirement: Compatibility and breaking-change controls
Components SHALL use explicit schema and contract versions. Additive compatible changes MAY replace the current canonical version directly; breaking changes MUST create a new major contract version, include migration guidance, and MUST NOT silently replace references whose compatibility range excludes it.

#### Scenario: Compatible change reaches consumers
- **WHEN** a component receives an additive change within a consumer's compatibility range
- **THEN** the consumer resolves the changed component and its affected tests are selected

#### Scenario: Breaking version is published
- **WHEN** a component introduces a breaking public-contract change
- **THEN** existing incompatible consumers remain on a compatible version and validation reports an available migration

### Requirement: Deterministic merge and override semantics
The resolver SHALL apply components in declared composition order using kind-specific deterministic merge rules. Variant overrides MUST name the target component and allowed override field; undeclared shadowing, duplicate stable identifiers, and incompatible contributions MUST fail validation.

#### Scenario: Variant changes presentation only
- **WHEN** a variant explicitly overrides an allowed label or color field
- **THEN** the resolved definition uses that local value while retaining the shared component behavior

#### Scenario: Two components collide
- **WHEN** selected components contribute the same stable game-part identifier without a declared merge relationship
- **THEN** resolution fails with both source component identifiers

### Requirement: Dependency graph safety
Library tooling SHALL construct the component-to-component and component-to-variant dependency graph, resolve dependencies deterministically, and reject dependency cycles and incompatible dependency ranges.

#### Scenario: Dependency cycle exists
- **WHEN** component A depends on component B and B transitively depends on A
- **THEN** validation fails and reports the complete cycle

#### Scenario: Dependency versions conflict
- **WHEN** selected components require mutually incompatible versions of a dependency
- **THEN** resolution fails before producing a runtime definition

### Requirement: Impact analysis and affected-variant verification
Tooling SHALL report all direct and transitive variant consumers of a component. A component change MUST validate, type-check, and run component contract tests plus the relevant tests for every affected variant before the change is considered complete.

#### Scenario: Developer changes a shared item
- **WHEN** impact analysis runs for that item component
- **THEN** it lists every variant that directly or transitively consumes the item

#### Scenario: Affected variant fails
- **WHEN** one affected variant fails resolution, type-checking, or tests after a shared update
- **THEN** the component change is not eligible for completion or archive

### Requirement: Component lifecycle is explicit
Library components SHALL declare active, deprecated, or retired lifecycle state. Deprecated components MUST name a supported replacement or migration path; retired components MUST NOT resolve for unpinned consumers.

#### Scenario: Deprecated component is consumed
- **WHEN** a variant resolves a deprecated component
- **THEN** resolution succeeds with an actionable migration warning

#### Scenario: Retired component is selected
- **WHEN** an unpinned manifest selects a retired component
- **THEN** validation fails and identifies the replacement or migration guidance
