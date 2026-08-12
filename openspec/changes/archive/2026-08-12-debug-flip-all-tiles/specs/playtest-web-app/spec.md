## ADDED Requirements

### Requirement: Debug reveal-all tiles
When run mode is enabled, the playtest app SHALL provide a Debug section with a control that reveals all tiles on the board for inspection. Turning the control off SHALL hide only tiles that are still face-down in game state (not yet revealed by play). Tiles already face-up from traversal or peeking SHALL remain visible.

#### Scenario: Debug shows every tile
- **WHEN** the player enables debug reveal-all
- **THEN** every cell on the board displays its face-up content

#### Scenario: Debug off hides only unrevealed tiles
- **WHEN** some tiles were revealed by play and others were only visible via debug reveal-all
- **AND** the player disables debug reveal-all
- **THEN** play-revealed tiles stay face-up and never-revealed tiles are face-down again
