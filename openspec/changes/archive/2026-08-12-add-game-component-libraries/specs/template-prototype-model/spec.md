## MODIFIED Requirements

### Requirement: Prototypes are named game versions
Each playable game version SHALL remain launchable by a stable prototype id under `prototypes/<prototype-id>/` during migration, but its authoritative definition SHALL be a variant composition manifest. The manifest MUST name the game, select reusable library components, declare compatibility ranges or pins, define explicit variant parameters and overrides, and identify any variant-only extensions.

#### Scenario: Composed prototype loads distinct display name
- **WHEN** a variant composition manifest sets a display name
- **THEN** the playtest UI shows that name after resolving its library components

#### Scenario: Legacy prototype remains launchable during migration
- **WHEN** an active prototype has not yet been converted to a composition manifest
- **THEN** the compatibility adapter loads its existing config and emits migration guidance

### Requirement: Optional prototype extensions
A variant MAY include an `extensions/` directory for behavior that cannot be expressed through existing library components. Before adding variant-only extension code, the workflow MUST determine whether the behavior belongs in a reusable component. The absence of extensions MUST still allow a valid composed variant to run.

#### Scenario: Variant without extensions runs
- **WHEN** a variant has a valid composition manifest and no extensions
- **THEN** the playtest app resolves and launches that variant successfully

#### Scenario: Shared behavior is proposed as local code
- **WHEN** behavior is intended for more than one variant
- **THEN** the development workflow directs the change into a canonical library component instead of a variant extension

### Requirement: Prototype rulebook file
Composed variants that expose player-facing rules SHALL keep a `RULEBOOK.md` under their stable variant directory and MAY export that markdown through extensions for the playtest UI. Shared player-facing rules SHALL trace to canonical component documentation, while the variant rulebook SHALL describe the resolved rules and intentional overrides.

#### Scenario: Component rule changes
- **WHEN** a player-facing component changes
- **THEN** impact analysis identifies every consuming variant rulebook that must be checked

## ADDED Requirements

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

## REMOVED Requirements

### Requirement: Templates hold reusable source
**Reason**: A whole-game template is too coarse to share individual pieces, tiles, rules, and behaviors or propagate their changes across selected variants.

**Migration**: Move reusable definitions into canonical game-component libraries, represent games as variant composition manifests, and retain `templates/tile-board` only as migration documentation until all active prototypes are composed.

### Requirement: Goblin Woods rough tiles declare pass items
**Reason**: This is variant-specific gameplay behavior and does not belong in the generic template/prototype model.

**Migration**: Preserve the requirement under the new `goblin-woods-variant` capability and implement its reusable parts through canonical components.

### Requirement: Goblin Woods Mage first tile
**Reason**: This is variant-specific board setup rather than a generic variant-model contract.

**Migration**: Preserve the requirement under `goblin-woods-variant` and express Mage start behavior through composition.

### Requirement: Goblin Woods corner extraction
**Reason**: This is a Goblin Woods map rule, not a generic prototype requirement.

**Migration**: Preserve it under `goblin-woods-variant` and assign implementation ownership to the appropriate extraction or board component.

### Requirement: Goblin Woods random castle
**Reason**: This is a Goblin Woods goal-placement rule, not part of the generic authoring model.

**Migration**: Preserve it under `goblin-woods-variant` and compose its implementation from board-placement and castle components.

### Requirement: Goblin Woods random content layout
**Reason**: This describes one variant's content distribution and should not define every prototype.

**Migration**: Preserve it under `goblin-woods-variant` and represent placement policies through explicit component parameters.

### Requirement: Goblin Woods shops and coin weights
**Reason**: This economy configuration is owned by Goblin Woods rather than the template/prototype model.

**Migration**: Preserve it under `goblin-woods-variant` and compose canonical economy/shop components where reusable.

### Requirement: Goblin Woods portals
**Reason**: This portal count and placement rule is variant-specific.

**Migration**: Preserve it under `goblin-woods-variant` and compose a portal component or feature bundle.
