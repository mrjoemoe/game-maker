## Purpose

Provides a browser playtest UI that renders a game definition and lets a designer flip tiles, move pieces, and reset state while prototyping.

## ADDED Requirements

### Requirement: Render configured board
The playtest web app SHALL render the board grid and show each cell's face-up tile content or a face-down back when the tile is hidden.

#### Scenario: Face-up tile shows type
- **WHEN** a tile is face-up
- **THEN** the UI shows that tile's type visual (at least label or color)

#### Scenario: Face-down tile hides type
- **WHEN** a tile is face-down
- **THEN** the UI shows a generic back and does not reveal the tile type label

### Requirement: Interactive tile flip
The playtest web app SHALL allow the user to flip a tile by interacting with its cell.

#### Scenario: Click flips tile
- **WHEN** the user activates a cell for flip
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

### Requirement: Load template game definition
The playtest web app SHALL load a game definition from the base template configuration so the designer can immediately playtest without editing app code beyond config.

#### Scenario: App starts with base template
- **WHEN** the playtest app starts
- **THEN** it displays the board defined by `templates/base-game`
