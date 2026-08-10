## MODIFIED Requirements

### Requirement: Tile count tally
When run mode is enabled, the playtest app SHALL show a side panel listing each tile type on the map with a count. When a tile type declares a `passItemId`, the tally row SHALL show that item (label and/or icon) as the gear used to pass it.

#### Scenario: Tally lists meadow count
- **WHEN** the goblin-woods board is loaded
- **THEN** the tile tally shows how many meadow tiles exist on the board

#### Scenario: Tally shows pass item for pit
- **WHEN** the goblin-woods board is loaded
- **THEN** the pit tally row indicates Makeshift Bridge (or its icon) as the pass item
