## MODIFIED Requirements

### Requirement: Goblin Woods random castle
The Goblin Woods board SHALL place exactly one castle goal tile at a randomly chosen eligible cell that is not the hero start and not a corner extraction cell. The castle SHALL require the sledgehammer as its pass item. The castle SHALL NOT rely on forced four-sided cell walls; map edge walls come from the global edge-wall placement.

#### Scenario: Castle not on start or corner
- **WHEN** the Goblin Woods board is resolved
- **THEN** exactly one cell has the castle type, and that cell is neither the start position nor a corner

#### Scenario: New map can move the castle
- **WHEN** the player starts a new map after a full reset
- **THEN** the castle cell may differ from the previous map's castle cell

#### Scenario: Castle requires sledgehammer
- **WHEN** the Goblin Woods variant is resolved
- **THEN** the castle tile type's `passItemId` is the sledgehammer

## ADDED Requirements

### Requirement: Goblin Woods places fifteen connected edge walls
Goblin Woods SHALL enable edge-wall generation with count 15. New map SHALL re-roll the seed. The resulting map MUST remain fully connected.

#### Scenario: Fifteen connected walls
- **WHEN** a Goblin Woods board is loaded
- **THEN** there are exactly 15 edge walls and every cell is reachable from the start cell
