## ADDED Requirements

### Requirement: Timeline template variants
A variant MAY bind to template id `timeline` via a canonical timeline feature bundle. That variant SHALL remain launchable by stable id under `prototypes/<id>/` and MUST NOT be scaffolded by copying another prototype’s full game definition.

#### Scenario: Timeline Game resolves from composition
- **WHEN** `timeline-game` is resolved from the catalog
- **THEN** the definition uses template `timeline`, enables timeline mode, and includes the eight devices Brancher through Jumper

### Requirement: Timeline Game launch
The development tooling SHALL launch Timeline Game with `./dev.sh up timeline-game [port]`.

#### Scenario: Launch timeline-game
- **WHEN** the playtest app is started with prototype id `timeline-game`
- **THEN** it shows the Timeline Game name and Play/Rulebook tabs
