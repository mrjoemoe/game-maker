## MODIFIED Requirements

### Requirement: Goblin Woods Mage first tile
The Goblin Woods hero start cell SHALL be a Mage tile (revealed at run start). The prototype SHALL include a sledgehammer item with `breaksSideWalls` available from the Mage item list. A separate Mage north of start is not required.

#### Scenario: Mage sits north of start
- **WHEN** the Goblin Woods board is loaded
- **THEN** the start position itself is the Mage tile (the opening tile the hero occupies)

#### Scenario: Start cell is Mage
- **WHEN** the Goblin Woods board is loaded
- **THEN** the start position’s tile type is Mage
