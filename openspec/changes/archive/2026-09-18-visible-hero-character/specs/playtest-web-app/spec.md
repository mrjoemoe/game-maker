## ADDED Requirements

### Requirement: Visible hero character
When a run-mode hero occupies a cell, the playtest board SHALL render that piece as a distinct character figure in the tile’s piece slot, not as a letter badge covering other chrome. The figure SHALL use the piece color and remain fully inside the cell. Other non-hero pieces MAY use a compact pawn token. The tile’s accessible name SHALL mention the occupying piece.

#### Scenario: Hero reads as a character
- **WHEN** Goblin Woods loads with the hero on the start tile
- **THEN** that cell shows a character figure rather than only the letter H

#### Scenario: Character stays in its slot
- **WHEN** the hero stands on a face-up tile that also shows coins and an effect icon
- **THEN** the character occupies the piece slot and does not cover the coin badge

#### Scenario: Tile names the hero
- **WHEN** the hero occupies a cell
- **THEN** that cell’s accessible name includes the hero
