# template-prototype-model Specification

## Purpose

Defines how named playable game versions (variants) relate to the shared runtime and the game component library.

## Requirements
### Requirement: Prototypes are named game versions
Each playable game version SHALL remain launchable by a stable prototype id under `prototypes/<prototype-id>/` during migration, but its authoritative definition SHALL be a variant composition manifest. The manifest MUST name the game, select reusable library components, declare compatibility ranges or pins, define explicit variant parameters and overrides, and identify any variant-only extensions.

#### Scenario: Composed prototype loads distinct display name
- **WHEN** a variant composition manifest sets a display name
- **THEN** the playtest UI shows that name after resolving its library components

#### Scenario: Legacy prototype remains launchable during migration
- **WHEN** an active prototype has not yet been converted to a composition manifest
- **THEN** the compatibility adapter loads its existing config and emits migration guidance

### Requirement: Config controls flip capability
A prototype config SHALL be able to enable or disable tile flipping. When disabled, flip actions MUST NOT change tile face state.

#### Scenario: Flip disabled
- **WHEN** a prototype sets tile flip to disabled and a flip action is requested
- **THEN** tile face states remain unchanged

### Requirement: Optional prototype extensions
A variant MAY include an `extensions/` directory for behavior that cannot be expressed through existing library components. Before adding variant-only extension code, the workflow MUST determine whether the behavior belongs in a reusable component. The absence of extensions MUST still allow a valid composed variant to run.

#### Scenario: Variant without extensions runs
- **WHEN** a variant has a valid composition manifest and no extensions
- **THEN** the playtest app resolves and launches that variant successfully

#### Scenario: Shared behavior is proposed as local code
- **WHEN** behavior is intended for more than one variant
- **THEN** the development workflow directs the change into a canonical library component instead of a variant extension

### Requirement: Simultaneous prototype launches
The development tooling SHALL allow launching more than one prototype at a time by selecting a prototype id and a host port.

#### Scenario: Two prototypes on different ports
- **WHEN** the developer starts prototype A on port 5173 and prototype B on port 5174
- **THEN** both playtest instances are reachable on their respective localhost ports

### Requirement: Config enables run mode
A prototype config SHALL be able to enable run mode and declare a run setup (hero piece, start position, max HP, base attack) plus optional items. When run mode is enabled, the playtest app SHALL present run-based interaction instead of free move/flip.

#### Scenario: Prototype enables run mode
- **WHEN** a prototype sets run mode enabled with a hero start position and max HP
- **THEN** the playtest app starts a run for that hero and shows run status

#### Scenario: Run mode is opt-in
- **WHEN** a prototype omits run mode
- **THEN** the prototype behaves as a normal flip/move tile-board game

### Requirement: Prototype rulebook file
Composed variants that expose player-facing rules SHALL keep a `RULEBOOK.md` under their stable variant directory and MAY export that markdown through extensions for the playtest UI. Shared player-facing rules SHALL trace to canonical component documentation, while the variant rulebook SHALL describe the resolved rules and intentional overrides.

#### Scenario: Component rule changes
- **WHEN** a player-facing component changes
- **THEN** impact analysis identifies every consuming variant rulebook that must be checked

### Requirement: Variant creation uses composition
New game versions SHALL be created by authoring a variant composition manifest from existing library components and creating new components only for missing reusable concepts. New variants MUST NOT be scaffolded by copying another prototype's complete game definition.

#### Scenario: New variant shares most game parts
- **WHEN** a developer spins off a variant from an existing game
- **THEN** the new manifest references the same components and declares only its intentional differences

### Requirement: Existing launch and registry contracts are preserved
The component migration SHALL preserve stable prototype ids, simultaneous launch by id and port, and registry-based discovery until a replacement registry contract is implemented and all active variants have migrated.

#### Scenario: Two migrated variants launch together
- **WHEN** two composed variants are started on different ports
- **THEN** both are reachable through the existing development workflow
