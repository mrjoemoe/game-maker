# playtest-web-app Specification

## Purpose

Provides a browser playtest UI that loads a selected prototype, renders its board, and lets a designer flip tiles (when enabled), move pieces, and reset state while prototyping.

## Requirements

### Requirement: Render configured board
The playtest web app SHALL render the board grid and show each cell's face-up tile content or a face-down back when the tile is hidden.

#### Scenario: Face-up tile shows type
- **WHEN** a tile is face-up
- **THEN** the UI shows that tile's type visual (at least label or color)

#### Scenario: Face-down tile hides type
- **WHEN** a tile is face-down
- **THEN** the UI shows a generic back and does not reveal the tile type label

### Requirement: Interactive tile flip
The playtest web app SHALL allow the user to flip a tile by interacting with its cell when flipping is enabled for the active prototype.

#### Scenario: Click flips tile
- **WHEN** the user activates a cell for flip and flip is enabled
- **THEN** that cell's tile face state toggles and the UI updates

### Requirement: Interactive piece move
The playtest web app SHALL allow selecting a piece and then selecting a destination cell to move it, updating the rendered board.

#### Scenario: Select then move
- **WHEN** the user selects a piece and then activates an in-bounds destination cell
- **THEN** the piece appears at the destination and no longer at the previous cell

### Requirement: Reset control
The playtest web app SHALL provide a control that resets the session to the game definition's initial board and piece layout.

#### Scenario: Reset restores initial layout
- **WHEN** the user activates reset after changing the board
- **THEN** the UI shows the initial tile face states and piece positions from the loaded game definition

### Requirement: Load prototype by launch selection
The playtest web app SHALL load the game definition from the prototype selected at launch (environment/config), not from a hard-coded single template package import.

#### Scenario: Launch meadow prototype
- **WHEN** the playtest app is started with prototype id `meadow-v1`
- **THEN** it renders the board and name from `prototypes/meadow-v1`

### Requirement: Honor flip feature flag in UI
When tile flipping is disabled for the active prototype, the playtest UI SHALL NOT offer flip mode (or SHALL no-op flip interactions).

#### Scenario: Flip UI hidden when disabled
- **WHEN** the active prototype disables tile flip
- **THEN** the Flip tiles control is not available as an active flip mode

### Requirement: Run-mode HUD and step interaction
When the active prototype enables run mode, the playtest app SHALL let the player move the hero one orthogonal step at a time by clicking an adjacent cell or using arrow keys, and SHALL display current/max HP, the item inventory, and the attempt count.

#### Scenario: Step by clicking a neighbor
- **WHEN** the player clicks a cell orthogonally adjacent to the hero
- **THEN** the app dispatches a step toward that cell

#### Scenario: HUD reflects run state
- **WHEN** the hero takes damage or collects an item
- **THEN** the HUD updates the HP display and inventory

### Requirement: Win/lose banner and retry
When a run ends, the app SHALL show a win or lose banner and offer a try-again control that soft resets the run while preserving the revealed map.

#### Scenario: Retry after losing
- **WHEN** a run is lost and the player selects try again
- **THEN** the hero returns to start with the map still revealed and a new attempt begins

### Requirement: Revealed tile effect icons
Revealed tiles SHALL display an indicator of their effect (enemy, trap, powerup, wall, goal) so the player can learn the map, and resolved enemy/powerup tiles SHALL be shown as cleared.

#### Scenario: Defeated enemy shown as cleared
- **WHEN** an enemy has been defeated on a cell
- **THEN** that cell is rendered as a cleared enemy tile
