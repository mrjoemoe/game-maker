# board-engine-core Specification

## Purpose

Provides a headless, layered tile-board engine: configurable grid, tile types, face-up/face-down tile state, pieces, feature flags, and deterministic game-state actions for prototyping.

## Requirements

### Requirement: Configurable square grid
The engine SHALL support square grids whose width and height are defined by configuration, and SHALL expose coordinate bounds checking and orthogonal neighbor lookup for in-bounds cells.

#### Scenario: Create grid from config
- **WHEN** a game definition specifies grid width W and height H
- **THEN** the engine creates a grid of W×H cells with coordinates (x, y) where 0 ≤ x < W and 0 ≤ y < H

#### Scenario: Reject out-of-bounds coordinates
- **WHEN** a consumer asks whether a coordinate outside the grid is in bounds
- **THEN** the engine reports that the coordinate is not in bounds

### Requirement: Configurable tile type registry
The engine SHALL allow a game definition to register one or more tile types, each with a stable id and display metadata (at least label and color).

#### Scenario: Resolve tile type by id
- **WHEN** a tile state references a registered tile type id
- **THEN** the engine can resolve that id to the registered tile type definition

### Requirement: Tile face-up and face-down state
Each board cell SHALL have a tile state that includes a tile type id and a face-up/face-down flag. The engine SHALL provide an action to flip a tile between face-up and face-down.

#### Scenario: Flip a face-down tile
- **WHEN** a flip action is applied to a cell whose tile is face-down
- **THEN** that tile becomes face-up

#### Scenario: Flip a face-up tile
- **WHEN** a flip action is applied to a cell whose tile is face-up
- **THEN** that tile becomes face-down

### Requirement: Board generation from config
The engine SHALL generate an initial board from a game definition that includes a default tile type for all cells and optional per-coordinate overrides for type and initial face state.

#### Scenario: Default tile type fills the board
- **WHEN** a board is generated with default tile type T and no overrides
- **THEN** every cell has tile type T

#### Scenario: Per-cell override applied
- **WHEN** a board is generated with an override at coordinate C for tile type U
- **THEN** cell C has tile type U and all other cells keep the default type

### Requirement: Configurable pieces and movement
The engine SHALL support configurable piece types and piece instances with positions on the board. The engine SHALL provide a move action that relocates a piece to an in-bounds destination. Occupancy and capture rules are not required in this capability.

#### Scenario: Move piece within bounds
- **WHEN** a move action targets an existing piece and an in-bounds destination
- **THEN** the piece's position becomes the destination

#### Scenario: Reject move out of bounds
- **WHEN** a move action targets a destination outside the grid
- **THEN** the engine rejects the move and leaves piece positions unchanged

### Requirement: Reset to initial definition
The engine SHALL provide a reset action that restores board tile states and piece positions to the values derived from the original game definition.

#### Scenario: Reset after play
- **WHEN** tiles have been flipped and pieces moved, and a reset action is applied
- **THEN** tile face states and piece positions match the initial configuration again

### Requirement: Feature flags on game definition
A game definition SHALL include feature flags that at least support enabling or disabling tile flipping.

#### Scenario: Definition declares flip disabled
- **WHEN** a game definition sets tile flip to false
- **THEN** consumers can read that flag from the definition

### Requirement: Flip respects feature flag
When tile flipping is disabled on the active definition, applying a flip action SHALL leave tile face states unchanged.

#### Scenario: Flip action ignored when disabled
- **WHEN** tile flip is disabled and a flipTile action is applied
- **THEN** the targeted tile's face state is unchanged

### Requirement: Tile effects
A tile type MAY declare an effect that resolves when a hero steps onto a cell of that type. Supported effects SHALL include: none/empty, wall (impassable), trap (damage), enemy (combat), powerup (grants an item), mage (choose one item), and goal (win).

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
The engine SHALL provide a step action that moves the hero to an in-bounds orthogonally adjacent cell and reveals that tile face up when the crossing is allowed. A step SHALL be a no-op when the run is not playing. Only empty-effect tiles (meadow/forest) are safe path tiles.

#### Scenario: Step onto an empty neighbor
- **WHEN** the hero steps onto an adjacent empty face-down tile
- **THEN** the hero moves there, the tile becomes face up, and the run stays playing

#### Scenario: Step into a full-cell wall
- **WHEN** the hero steps toward an adjacent full-cell wall tile
- **THEN** the wall tile becomes face up, the hero's position is unchanged, and the run is lost with a path-over message

#### Scenario: Step onto a non-empty hazard or goal
- **WHEN** the hero steps onto a trap, enemy, powerup, or goal tile
- **THEN** the hero moves onto that tile, the run is lost, and the bump message reports that the path is over because of that tile

### Requirement: Soft reset preserves learned map and items
The engine SHALL provide a soft reset action that returns the hero to the start position, restores HP to max, seeds the inventory from discovered items, increments the attempt count, and clears enemy resolved flags, while preserving revealed tile faces and discovered items.

#### Scenario: Retry after defeat keeps the map
- **WHEN** a run ends lost and a soft reset is applied
- **THEN** the hero returns to start with full HP, previously revealed tiles stay face up, and items discovered in prior attempts are in the inventory

#### Scenario: Full reset clears discoveries
- **WHEN** a full reset action is applied
- **THEN** tile faces, hero position, run state, and discovered items all return to the initial definition

### Requirement: Programmed path length
A run-mode definition MAY set `programLength` (default 6). The engine SHALL accept a `runProgram` of exactly that many orthogonal steps and SHALL stop applying further steps once the run is no longer playing.

#### Scenario: Program stops after path-over
- **WHEN** a programmed step ends the run as lost
- **THEN** remaining steps in that program are not applied

### Requirement: Side walls on tiles
Board cells MAY carry zero or more orthogonal side walls. Board config MAY generate side walls with weights favoring mostly none, some one-sided, and few two-sided walls in random orientations. Crossing a walled edge SHALL reveal the destination and end the run as lost with a reported reason.

#### Scenario: Side wall ends the path
- **WHEN** the hero attempts to cross a side wall
- **THEN** the destination tile is revealed, the hero does not move, and the run is lost with a wall path-over message

### Requirement: Safe path tiles only
In run mode, stepping onto a tile whose effect is not empty (meadow/forest) SHALL end the run as lost and report why (e.g. found a Castle — path over), unless the tile declares a `passItemId` that is in the run inventory, or the tile is a Mage (choice) effect. Full-cell wall tiles without a held pass item SHALL reveal, keep the hero in place, and end the run as lost.

#### Scenario: Castle ends the path
- **WHEN** the hero steps onto a goal/castle tile without its pass item
- **THEN** the run status becomes lost and the bump message states the castle ended the path

### Requirement: Pass item traverses rough tiles
A tile type MAY declare `passItemId`. When the hero steps toward or onto that tile and the run inventory includes that item, the engine SHALL treat the tile as traversable: reveal it, move the hero onto it, and keep the run playing. If the tile effect is goal, the run SHALL be won instead of lost. Without the pass item, existing path-over / wall-block behavior SHALL apply. Side-wall crossings SHALL NOT be cleared by pass items.

#### Scenario: Wall tile with pass item is crossed
- **WHEN** the hero steps toward a full-cell wall tile whose `passItemId` is in inventory
- **THEN** the tile is revealed, the hero moves onto it, and the run stays playing

#### Scenario: Hazard without pass item still paths over
- **WHEN** the hero steps onto a trap or enemy tile and does not hold that tile's `passItemId`
- **THEN** the hero moves onto the tile and the run is lost with a path-over message

#### Scenario: Goal with pass item wins
- **WHEN** the hero steps onto a goal tile and holds that tile's `passItemId`
- **THEN** the hero moves onto the tile and the run status becomes won

### Requirement: Mage grants a chosen item
A tile type MAY declare effect kind `mage`. Stepping onto an unresolved Mage tile SHALL reveal it, move the hero onto it, keep the run playing, and set a pending item choice for that cell. While a choice is pending, further steps SHALL be no-ops. Choosing an item from the game’s item registry SHALL add it to inventory and discovered items, mark the Mage cell resolved, and clear the pending choice. Stepping onto a resolved Mage SHALL move the hero and keep the run playing (safe pass-through). Soft reset SHALL preserve Mage resolved state and re-seed inventory from discovered items.

#### Scenario: First visit to Mage opens a choice
- **WHEN** the hero steps onto an unresolved Mage tile
- **THEN** the hero is on that tile, the run stays playing, and a pending item choice is set

#### Scenario: Choosing an item grants and persists it
- **WHEN** the player chooses an item while a Mage choice is pending
- **THEN** that item is in inventory and discoveredItemIds, the Mage cell is resolved, and the pending choice is cleared

#### Scenario: Soft reset keeps discovered gear
- **WHEN** a soft reset runs after an item was granted by the Mage
- **THEN** the new attempt’s inventory includes that item and the Mage remains resolved
