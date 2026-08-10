## MODIFIED Requirements

### Requirement: Side walls on tiles
Board cells MAY carry zero or more orthogonal side walls. Board config MAY generate side walls with weights favoring mostly none, some one-sided, and few two-sided walls in random orientations. Crossing a walled edge SHALL end the run as lost with a reported reason. When the block is on the hero’s current tile (exit side), the destination SHALL NOT be revealed. When the block is only on the destination’s entry side, the destination SHALL be revealed.

#### Scenario: Side wall ends the path
- **WHEN** the hero attempts to cross a side wall on the destination tile only
- **THEN** the destination tile is revealed, the hero does not move, and the run is lost with a wall path-over message

#### Scenario: Origin side wall does not reveal the next tile
- **WHEN** the hero attempts to leave through a side wall on their current tile
- **THEN** the destination stays face down, the hero does not move, and the run is lost with a this-tile wall path-over message
