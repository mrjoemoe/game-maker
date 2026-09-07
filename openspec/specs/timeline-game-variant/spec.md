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

### Requirement: One-player playtest mode
Timeline Game SHALL run as a **1-player** playtest (`playerCount` 1). The Play tab SHALL label this mode. Further playtest edits apply to this 1-player mode until a multiplayer mode is added.

#### Scenario: Solo mode is labeled
- **WHEN** Timeline Game is resolved and shown on the Play tab
- **THEN** the definition’s timeline `playerCount` is 1 and the UI indicates 1-player mode

### Requirement: Brancher plays a card onto the fork
Timeline Game Brancher SHALL fork from a chosen moment and require an action card from hand to start the new timeline. It SHALL NOT place an Open rift tile.

#### Scenario: Rulebook describes the card
- **WHEN** a player reads the Devices section of Timeline Game’s rulebook
- **THEN** Brancher is described as forking a timeline and laying an action card onto the new branch
