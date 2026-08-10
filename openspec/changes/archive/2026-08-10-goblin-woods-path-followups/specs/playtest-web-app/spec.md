## ADDED Requirements

### Requirement: Path planner UI
When run mode is enabled, the playtest app SHALL provide a side path planner to queue exactly `programLength` orthogonal moves and execute them in order, stopping when the run ends.

#### Scenario: Run path executes queued moves
- **WHEN** the player fills all program slots and activates run path
- **THEN** the app applies those steps in order until the program finishes or the run ends

### Requirement: Tile count tally
When run mode is enabled, the playtest app SHALL show a side panel listing each tile type on the map with a count.

#### Scenario: Tally lists meadow count
- **WHEN** the goblin-woods board is loaded
- **THEN** the tile tally shows how many meadow tiles exist on the board

### Requirement: Visible side walls and path-over report
Revealed tiles with side walls SHALL show visible wall indicators on those sides. When a run ends because the path is over, the UI SHALL display the engine’s path-over reason.

#### Scenario: Lose banner shows path-over reason
- **WHEN** the run is lost with a bump message
- **THEN** the lose banner shows that message
