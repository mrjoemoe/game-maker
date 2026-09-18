## MODIFIED Requirements

### Requirement: Playtest UI renders edge walls
The playtest board SHALL visually indicate every edge wall on the shared boundary between cells using a single board-level overlay. Walls SHALL remain visible regardless of whether adjacent tiles are face-up or face-down. Each shared walled edge SHALL appear as one smooth stroke between the two cells (not a pair of per-tile bars). Edge-wall strokes SHALL use a high-contrast warm wood color so they are easy to see against the board. When a run ends because the path is over, the UI SHALL display the engine’s path-over reason.

#### Scenario: Walls visible on a fresh map
- **WHEN** a Goblin Woods map loads with face-down tiles
- **THEN** all edge walls on the board are visible in the overlay between cells

#### Scenario: Shared edge shows a wall segment
- **WHEN** two adjacent cells share a walled edge
- **THEN** the UI shows a single wall stroke on that boundary

#### Scenario: Edge walls read brightly
- **WHEN** the playtest board is displayed
- **THEN** edge-wall strokes use a bright warm wood palette that contrasts with face-down and face-up tiles

#### Scenario: Lose banner shows path-over reason
- **WHEN** the run is lost with a bump message
- **THEN** the lose banner shows that message

#### Scenario: No doubled wall bars
- **WHEN** a shared edge has a wall
- **THEN** that edge is not drawn as two overlapping bars from each adjacent tile
