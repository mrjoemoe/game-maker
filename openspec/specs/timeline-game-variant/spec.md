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

### Requirement: Merger continues on the destination timeline
Timeline Game Merger SHALL join the heads of two existing branches. The incoming timeline SHALL end; the destination timeline SHALL still be able to grow from its head. It SHALL NOT start a third confluence timeline.

#### Scenario: Rulebook describes the join
- **WHEN** a player reads the Devices section of Timeline Game’s rulebook
- **THEN** Merger is described as joining two timeline heads so the first ends and the second can still grow

### Requirement: Rewriter swaps with a hand card
Timeline Game Rewriter SHALL swap a played timeline card with a card in hand. The Play banner SHALL ask for the timeline card, then the hand card.

#### Scenario: Rulebook describes the swap
- **WHEN** a player reads the Devices section of Timeline Game’s rulebook
- **THEN** Rewriter is described as swapping a hand card with a card on the timeline

### Requirement: Omega, action, and blueprint piles
Timeline Game SHALL keep three facedown piles: **Omega events** (person, place, thing; 30 cards), **action cards** (society, invention, resource, Random Event, Draw Blueprint), and **blueprints**. Hand draws SHALL come from the action pile. Playing Random Event SHALL place the top Omega card on the timeline. Playing Draw Blueprint SHALL add the top blueprint to the hand.

#### Scenario: Thirty Omega events
- **WHEN** Timeline Game is resolved from `core/timeline`
- **THEN** there are 30 person/place/thing cards

#### Scenario: Random Event places Omega
- **WHEN** the player plays a Random Event action on a timeline moment
- **THEN** the top Omega event is placed there and the Random Event card is not left on that node

#### Scenario: Draw Blueprint fills the hand
- **WHEN** the player plays Draw Blueprint
- **THEN** the top blueprint is added to the hand

#### Scenario: Rulebook names the three piles
- **WHEN** a player reads the Cards section of Timeline Game’s rulebook
- **THEN** it describes Omega events, action cards, and blueprints as separate piles

### Requirement: Device costs in the rulebook
The Timeline Game rulebook Devices section SHALL list the build cost for each device A–H: parts, minerals, crystals, and the required culture, science, and politics.

#### Scenario: Brancher cost is listed
- **WHEN** a player reads the Devices section of Timeline Game’s rulebook
- **THEN** Brancher shows 2 parts, 5 minerals, 1 crystal, culture 4, science 2, and politics 0

#### Scenario: Every device has a numeric cost
- **WHEN** a player reads the Devices table
- **THEN** each of devices A–H has parts, minerals, crystal, and society numbers rather than only high/low wording
