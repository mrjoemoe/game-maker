# timeline-game-variant Specification

## Purpose

Owns Timeline Game–specific gameplay and playtest requirements composed from the game component library.

## Requirements

### Requirement: Timeline Game identity
The `timeline-game` variant SHALL be named Timeline Game, composed from `core/timeline`, and SHALL ship a player-facing `RULEBOOK.md` covering objectives, turns, cards, player/branch mats, devices, branch limits, and end of time.

#### Scenario: Variant display name
- **WHEN** the variant manifest is resolved
- **THEN** the game definition name is Timeline Game and the id is `timeline-game`

### Requirement: Debug-first playtest
Timeline Game SHALL default debug mode on so a designer can move, draw, play cards, and use devices A–H without satisfying build costs.

#### Scenario: Debug defaults on
- **WHEN** Timeline Game is initialized from its library composition
- **THEN** timeline debug mode is enabled
