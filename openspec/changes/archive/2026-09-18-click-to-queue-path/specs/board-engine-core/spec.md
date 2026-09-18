## ADDED Requirements

### Requirement: Shortest orthogonal walk
The engine SHALL compute a shortest orthogonal walk between two in-bounds cells, treating a crossing as blocked when a caller-supplied edge is walled and treating a cell as blocked when a caller-supplied predicate says so. The walk SHALL be returned as a list of cardinal directions from the origin, excluding the origin itself. A walk from a cell to itself SHALL be empty. When no walk exists, the engine SHALL return no path.

#### Scenario: Walk around a wall
- **WHEN** cells (0,0) and (1,0) share an edge wall and (0,1) is open
- **THEN** the shortest walk from (0,0) to (1,0) is down then right (or an equally short detour)

#### Scenario: Same cell is empty
- **WHEN** origin and destination are the same cell
- **THEN** the walk is an empty direction list

#### Scenario: Blocked destination has no path
- **WHEN** the destination cell is marked blocked
- **THEN** the engine returns no path
