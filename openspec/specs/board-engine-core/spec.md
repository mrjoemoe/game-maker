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
