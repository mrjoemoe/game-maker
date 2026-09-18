## ADDED Requirements

### Requirement: Run-mode debug tools
When run mode is enabled, the playtest app SHALL provide a debug mode control. While debug mode is on, the app SHALL offer: reveal-all tiles, a per-cell coordinate overlay, an inspector for the last activated cell (type, face, coins, walls, effect), a walk-now control that applies live orthogonal steps along the shortest walk to a clicked cell, and a teleport control that relocates the hero to a clicked in-bounds cell without resolving tile effects. While walk-now or teleport is on, activating a cell SHALL NOT append actions to the chart. Turning debug mode off SHALL hide the extra tools; reveal-all SHALL revert to hiding unrevealed tiles.

#### Scenario: Coordinates appear in debug
- **WHEN** debug mode and the coordinate overlay are on
- **THEN** each cell shows its x,y coordinate

#### Scenario: Inspector names the tile
- **WHEN** debug mode is on and the player activates a cell
- **THEN** the debug inspector shows that cell’s coordinate and tile type id

#### Scenario: Walk-now steps the hero
- **WHEN** debug walk-now is on and the player activates an orthogonally reachable open cell
- **THEN** the hero’s live position updates along that walk without adding chart slots

#### Scenario: Teleport skips effects
- **WHEN** debug teleport is on and the player activates a distant cell
- **THEN** the hero is shown on that cell and the action track is unchanged

## MODIFIED Requirements

### Requirement: Debug reveal-all tiles
When run mode is enabled, the playtest app SHALL provide a Debug section with a control that reveals all tiles on the board for inspection. Turning the control off SHALL hide only tiles that are still face-down in game state (not yet revealed by play). Tiles already face-up from traversal or peeking SHALL remain visible. Reveal-all SHALL remain available from the Debug section.

#### Scenario: Debug shows every tile
- **WHEN** the player enables debug reveal-all
- **THEN** every cell on the board displays its face-up content

#### Scenario: Debug off hides only unrevealed tiles
- **WHEN** some tiles were revealed by play and others were only visible via debug reveal-all
- **AND** the player disables debug reveal-all
- **THEN** play-revealed tiles stay face-up and never-revealed tiles are face-down again
