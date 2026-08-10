## ADDED Requirements

### Requirement: Random placements may set walls
A board `randomPlacements` entry MAY declare `walls`. When set, the placed cell SHALL receive those side walls (replacing any previously generated walls on that cell).

#### Scenario: Placement applies walls
- **WHEN** a random placement for a type includes walls on all four sides
- **THEN** the placed cell has those four side walls

## MODIFIED Requirements

### Requirement: Sledgehammer breaks side walls
An item MAY declare `breaksSideWalls`. Using that item as a step action SHALL clear side walls on the edge being crossed when that crossing is blocked and SHALL consume the item from the run inventory after the move succeeds; using it when the crossing is not blocked SHALL fail the run.

#### Scenario: Sledgehammer clears a blocked crossing
- **WHEN** the hero uses a breaksSideWalls item and the upcoming move is blocked by a side wall
- **THEN** those walls are cleared, the move proceeds, and the item is removed from the run inventory

#### Scenario: Sledgehammer enters a walled goal
- **WHEN** the hero uses a breaksSideWalls item whose id is the goal’s passItemId and moves onto that goal through a blocked side wall
- **THEN** the walls are cleared, the hero wins, and the item is consumed (not banked)
