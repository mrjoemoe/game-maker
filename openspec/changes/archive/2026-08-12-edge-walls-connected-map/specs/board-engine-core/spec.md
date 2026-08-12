## ADDED Requirements

### Requirement: Walls live on edges between cells
The board SHALL store walls as undirected edges between orthogonally adjacent cells, not as faces owned by a single tile. Crossing from A to B is blocked if and only if the shared edge between A and B has a wall.

#### Scenario: Approach direction does not double-count
- **WHEN** a wall sits on the shared edge between two cells
- **THEN** moving either direction across that edge is blocked the same way

### Requirement: Fixed-count random edge walls keep the map connected
When edge-wall generation is enabled, the board SHALL place exactly the configured number of edge walls using a seeded RNG. After placement, every cell on the grid MUST remain reachable from every other cell via unblocked orthogonal moves.

#### Scenario: Fifteen walls on Goblin Woods
- **WHEN** a Goblin Woods map is created with edge-wall count 15
- **THEN** the board has exactly 15 edge walls and the full grid is connected

#### Scenario: New map re-rolls edges
- **WHEN** the player activates New map
- **THEN** edge walls are regenerated from a new seed while preserving count and connectivity

### Requirement: Clearing tools remove the shared edge
Sledgehammer Use and matching pass-item Use SHALL clear the single shared edge for the attempted crossing when that action succeeds.

#### Scenario: Sledgehammer clears one edge
- **WHEN** the hero Uses sledgehammer across a walled shared edge
- **THEN** that edge wall is removed and the move may proceed
