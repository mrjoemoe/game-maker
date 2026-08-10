## ADDED Requirements

### Requirement: Programmed path length
A run-mode definition MAY set `programLength` (default 6). The engine SHALL accept a `runProgram` of exactly that many orthogonal steps and SHALL stop applying further steps once the run is no longer playing.

#### Scenario: Program stops after path-over
- **WHEN** a programmed step ends the run as lost
- **THEN** remaining steps in that program are not applied

### Requirement: Side walls on tiles
Board cells MAY carry zero or more orthogonal side walls. Board config MAY generate side walls with weights favoring mostly none, some one-sided, and few two-sided walls in random orientations. Crossing a walled edge SHALL reveal the destination and end the run as lost with a reported reason.

#### Scenario: Side wall ends the path
- **WHEN** the hero attempts to cross a side wall
- **THEN** the destination tile is revealed, the hero does not move, and the run is lost with a wall path-over message

### Requirement: Safe path tiles only
In run mode, stepping onto a tile whose effect is not empty (meadow/forest) SHALL move onto the tile when enterable, end the run as lost, and report why (e.g. found a Castle — path over). Full-cell wall tiles SHALL reveal, keep the hero in place, and end the run as lost.

#### Scenario: Castle ends the path
- **WHEN** the hero steps onto a goal/castle tile
- **THEN** the run status becomes lost and the bump message states the castle ended the path
