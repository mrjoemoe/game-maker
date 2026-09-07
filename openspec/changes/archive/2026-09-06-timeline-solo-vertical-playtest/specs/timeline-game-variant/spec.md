## ADDED Requirements

### Requirement: One-player playtest mode
Timeline Game SHALL run as a **1-player** playtest (`playerCount` 1). The Play tab SHALL label this mode. Further playtest edits apply to this 1-player mode until a multiplayer mode is added.

#### Scenario: Solo mode is labeled
- **WHEN** Timeline Game is resolved and shown on the Play tab
- **THEN** the definition’s timeline `playerCount` is 1 and the UI indicates 1-player mode
