## ADDED Requirements

### Requirement: Run-mode keyboard and seed copy
When run mode is enabled, the playtest app SHALL treat arrow keys as directional move appends (the same as the action bank), Escape as Clear, D as toggling debug mode, and Enter as Run when Run would be enabled. Shortcuts SHALL be ignored while typing in a form field. The Debug section SHALL offer a control that copies the current map seed when the prototype uses seeded edge walls, and a control that copies the inspector line. The toolbar SHALL display that seed when it exists.

#### Scenario: Arrow queues a move
- **WHEN** the run is playing, the chart has room, and the player presses ArrowRight
- **THEN** a move-right action is appended to the track

#### Scenario: Escape clears
- **WHEN** the track has queued actions and the player presses Escape
- **THEN** the track is emptied

#### Scenario: Seed is copyable
- **WHEN** debug mode is on and the map was generated with an edge-wall seed
- **THEN** the player can copy that seed from the Debug section
