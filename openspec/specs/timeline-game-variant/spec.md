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
Timeline Game Merger SHALL end one existing branch into another existing branch. It SHALL NOT start a third confluence timeline.

#### Scenario: Rulebook describes the join
- **WHEN** a player reads the Devices section of Timeline Game’s rulebook
- **THEN** Merger is described as merging one timeline into another so the first ends and play continues on the second

### Requirement: Rewriter swaps with a hand card
Timeline Game Rewriter SHALL swap a played timeline card with a card in hand. The Play banner SHALL ask for the timeline card, then the hand card.

#### Scenario: Rulebook describes the swap
- **WHEN** a player reads the Devices section of Timeline Game’s rulebook
- **THEN** Rewriter is described as swapping a hand card with a card on the timeline

### Requirement: Action deck only
Timeline Game SHALL use a single action deck. It SHALL NOT include a random-event deck, a “draw a random event” card, or random-event cards (setback, windfall, blank, chaos, transport, shift). The rulebook SHALL NOT require playing a random event after action cards.

#### Scenario: Catalog has no random-event cards
- **WHEN** Timeline Game is resolved from `core/timeline`
- **THEN** the card list has no Random Event draw card and no random-event cards

#### Scenario: Rulebook has no random event step
- **WHEN** a player reads the Turn and Cards sections of Timeline Game’s rulebook
- **THEN** those sections do not tell the player to draw or play a random event

### Requirement: Device costs in the rulebook
The Timeline Game rulebook Devices section SHALL list the build cost for each device A–H: parts, minerals, crystals, and the required culture, science, and politics.

#### Scenario: Brancher cost is listed
- **WHEN** a player reads the Devices section of Timeline Game’s rulebook
- **THEN** Brancher shows 2 parts, 5 minerals, 1 crystal, culture 4, science 2, and politics 0

#### Scenario: Every device has a numeric cost
- **WHEN** a player reads the Devices table
- **THEN** each of devices A–H has parts, minerals, crystal, and society numbers rather than only high/low wording
