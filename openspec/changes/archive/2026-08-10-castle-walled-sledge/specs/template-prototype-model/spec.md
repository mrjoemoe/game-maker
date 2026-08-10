## MODIFIED Requirements

### Requirement: Goblin Woods rough tiles declare pass items
The Goblin Woods prototype SHALL assign a pass item to each rough terrain tile type (pit, river, thicket, snare, goblin, brute, villain, castle) and SHALL leave sword/shield cache tiles without a pass item. The prototype item list SHALL include those pass items (reusing Sword where applicable). The castle’s pass item SHALL be the sledgehammer.

#### Scenario: Pit requires makeshift bridge
- **WHEN** the Goblin Woods definition is loaded
- **THEN** the pit tile type's `passItemId` is the makeshift-bridge item

#### Scenario: Castle requires sledgehammer
- **WHEN** the Goblin Woods definition is loaded
- **THEN** the castle tile type's `passItemId` is the sledgehammer item

### Requirement: Goblin Woods random castle
The Goblin Woods board SHALL place exactly one castle (goal) tile at a randomly chosen eligible cell that is not the hero start and not a corner extraction cell. That castle cell SHALL have side walls on all four sides. The castle SHALL NOT be fixed to a single hardcoded coordinate across new maps.

#### Scenario: Castle not on start or corner
- **WHEN** the Goblin Woods board is loaded
- **THEN** exactly one cell has the castle type, and that cell is neither the start position nor a corner

#### Scenario: New map can move the castle
- **WHEN** the player starts a new map after a full reset
- **THEN** the castle cell may differ from the previous map’s castle cell (random placement)

#### Scenario: Castle is fully walled
- **WHEN** the Goblin Woods board is loaded
- **THEN** the castle cell has side walls on north, east, south, and west
