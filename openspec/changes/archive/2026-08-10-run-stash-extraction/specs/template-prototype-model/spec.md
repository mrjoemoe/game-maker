## ADDED Requirements

### Requirement: Goblin Woods corner extraction
The Goblin Woods board SHALL place extraction tiles on all four corner cells. Those corners SHALL be face up at run start and SHALL remain extraction points for the life of the map.

#### Scenario: Four corners are extraction
- **WHEN** the Goblin Woods board is loaded
- **THEN** cells (0,0), (width-1,0), (0,height-1), and (width-1,height-1) are extraction tiles and face up

### Requirement: Goblin Woods random castle
The Goblin Woods board SHALL place exactly one castle (goal) tile at a randomly chosen eligible cell that is not the hero start and not a corner extraction cell. The castle SHALL NOT be fixed to a single hardcoded coordinate across new maps.

#### Scenario: Castle not on start or corner
- **WHEN** the Goblin Woods board is loaded
- **THEN** exactly one cell has the castle type, and that cell is neither the start position nor a corner

#### Scenario: New map can move the castle
- **WHEN** the player starts a new map after a full reset
- **THEN** the castle cell may differ from the previous map’s castle cell (random placement)
