## Purpose

Add an optional run-based exploration capability to the engine: tiles carry gameplay effects, a hero has HP and an item inventory, and the game supports a die-and-retry loop that preserves the revealed map and found items across attempts.

## ADDED Requirements

### Requirement: Tile effects
A tile type MAY declare an effect that resolves when a hero steps onto a cell of that type. Supported effects SHALL include: none/empty, wall (impassable), trap (damage), enemy (combat), powerup (grants an item), and goal (win).

#### Scenario: Tile type declares an effect
- **WHEN** a tile type is defined with an enemy effect of power P and damage D
- **THEN** the engine can resolve that tile type to its effect kind and parameters

#### Scenario: Tile without an effect is inert
- **WHEN** a hero steps onto a tile type with no effect
- **THEN** no damage, item, or status change occurs

### Requirement: Per-cell resolved state
Each board cell SHALL track whether its one-shot effect has been resolved so that enemies and power-ups fire only once per cell until reset.

#### Scenario: Power-up collected once
- **WHEN** a hero steps onto an unresolved powerup cell and then steps onto it again
- **THEN** the item is granted only on the first visit and the cell is marked resolved

### Requirement: Item registry
A game definition MAY declare items, each with a stable id and optional attack and max-HP bonuses. The engine SHALL aggregate an inventory's items into an effective attack and max-HP value.

#### Scenario: Aggregate inventory bonuses
- **WHEN** an inventory holds items whose attack bonuses sum to B on top of a base attack A
- **THEN** the engine reports effective attack A + B

### Requirement: Run state
When run mode is enabled, the game state SHALL include a run with status (playing, won, or lost), current and max HP, an inventory of item ids, and an attempt count.

#### Scenario: Initial run state
- **WHEN** a run-mode game is created with max HP M
- **THEN** the run starts playing with HP M, an empty or seeded inventory, and attempt count 1

### Requirement: Step action reveals and resolves tiles
The engine SHALL provide a step action that moves the hero to an in-bounds orthogonally adjacent cell, reveals that tile face up, and resolves its effect. A wall SHALL reveal the tile but reject the move. A step SHALL be a no-op when the run is not playing.

#### Scenario: Step onto an empty neighbor
- **WHEN** the hero steps onto an adjacent empty face-down tile
- **THEN** the hero moves there and the tile becomes face up

#### Scenario: Step into a wall
- **WHEN** the hero steps toward an adjacent wall tile
- **THEN** the wall tile becomes face up and the hero's position is unchanged

#### Scenario: Step onto a trap
- **WHEN** the hero steps onto a trap tile with damage D
- **THEN** the hero's HP decreases by D and the run becomes lost if HP reaches zero

#### Scenario: Step onto an enemy and win
- **WHEN** the hero's effective attack is at least the enemy's power
- **THEN** the enemy is defeated, its cell is marked resolved, and any reward item is added to the inventory

#### Scenario: Step onto an enemy and lose the fight
- **WHEN** the hero's effective attack is below the enemy's power
- **THEN** the hero takes the enemy's damage and the enemy cell is not resolved

#### Scenario: Step onto the goal
- **WHEN** the hero steps onto a goal tile
- **THEN** the run status becomes won

### Requirement: Soft reset preserves learned map and items
The engine SHALL provide a soft reset action that returns the hero to the start position, restores HP to max, seeds the inventory from discovered items, increments the attempt count, and clears enemy resolved flags, while preserving revealed tile faces and discovered items.

#### Scenario: Retry after defeat keeps the map
- **WHEN** a run ends lost and a soft reset is applied
- **THEN** the hero returns to start with full HP, previously revealed tiles stay face up, and items discovered in prior attempts are in the inventory

#### Scenario: Full reset clears discoveries
- **WHEN** a full reset action is applied
- **THEN** tile faces, hero position, run state, and discovered items all return to the initial definition
