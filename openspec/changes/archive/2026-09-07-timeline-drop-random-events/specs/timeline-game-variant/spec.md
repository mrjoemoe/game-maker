## ADDED Requirements

### Requirement: Action deck only
Timeline Game SHALL use a single action deck. It SHALL NOT include a random-event deck, a “draw a random event” card, or random-event cards (setback, windfall, blank, chaos, transport, shift). The rulebook SHALL NOT require playing a random event after action cards.

#### Scenario: Catalog has no random-event cards
- **WHEN** Timeline Game is resolved from `core/timeline`
- **THEN** the card list has no Random Event draw card and no random-event cards

#### Scenario: Rulebook has no random event step
- **WHEN** a player reads the Turn and Cards sections of Timeline Game’s rulebook
- **THEN** those sections do not tell the player to draw or play a random event
