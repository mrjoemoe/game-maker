## ADDED Requirements

### Requirement: Play and Rulebook routes
When the active prototype has a rulebook, the playtest app SHALL show Play at `/play` and Rulebook at `/rulebook`. Visiting `/` SHALL show Play at `/play`. Changing tabs SHALL update the path without resetting the playtest session.

#### Scenario: Rulebook URL
- **WHEN** the player opens `/rulebook` on a prototype that has a rulebook
- **THEN** the Rulebook view is shown and the address is `/rulebook`

#### Scenario: Play URL
- **WHEN** the player opens `/play` or `/`
- **THEN** the Play view is shown and the address is `/play`

#### Scenario: Tab switch keeps the session
- **WHEN** the player switches between Play and Rulebook
- **THEN** the path changes to `/play` or `/rulebook` and the playtest game state is not reset

## MODIFIED Requirements

### Requirement: Play and Rulebook tabs for Timeline Game
Timeline Game SHALL offer Play and Rulebook tabs at `/play` and `/rulebook`. Rulebook SHALL show the variant `RULEBOOK.md`.

#### Scenario: Open Timeline Game rulebook
- **WHEN** the player selects the Rulebook tab or opens `/rulebook`
- **THEN** the Timeline Game rules markdown is shown instead of the timeline canvas
