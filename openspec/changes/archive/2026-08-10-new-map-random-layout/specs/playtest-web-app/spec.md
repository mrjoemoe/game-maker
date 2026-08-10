## MODIFIED Requirements

### Requirement: Reset control
The playtest web app SHALL provide a control that resets the session to the game definition's initial board and piece layout. In run mode that control is labeled New map and SHALL produce a freshly generated layout when the prototype uses seeded side walls / random placements (new seed → new walls and content placements).

#### Scenario: Reset restores initial layout
- **WHEN** the user activates reset after changing the board
- **THEN** the UI shows the initial tile face states and piece positions from the loaded game definition

#### Scenario: New map changes wall layout
- **WHEN** the user activates New map on a run-mode prototype with generated side walls
- **THEN** the session starts a new run whose side-wall seed differs from the previous map’s seed
