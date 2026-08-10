## MODIFIED Requirements

### Requirement: Random placements may set walls
A board `randomPlacements` entry MAY declare `walls` and MAY declare `count` (default 1). The engine SHALL place that many cells of the given type onto eligible cells (seeded via the board side-wall seed), applying walls when provided. Each placed cell SHALL no longer be eligible for later placements that target the previous type.

#### Scenario: Placement applies walls
- **WHEN** a random placement for a type includes walls on all four sides
- **THEN** the placed cell has those four side walls

#### Scenario: Count places multiple cells
- **WHEN** a random placement requests count 3 for a type on meadow cells
- **THEN** exactly three cells of that type are placed on formerly eligible meadow cells
