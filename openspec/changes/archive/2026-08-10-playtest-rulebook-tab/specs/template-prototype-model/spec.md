## ADDED Requirements

### Requirement: Prototype rulebook file
Run-mode prototypes that expose player-facing rules SHALL keep a `RULEBOOK.md` under `prototypes/<prototype-id>/` and MAY export that markdown via prototype extensions for the playtest UI.

#### Scenario: Goblin Woods has a rulebook
- **WHEN** an agent inspects `prototypes/goblin-woods/`
- **THEN** a `RULEBOOK.md` describing current Goblin Woods rules is present
