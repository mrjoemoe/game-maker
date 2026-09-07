## MODIFIED Requirements

### Requirement: Timeline mode on the game definition
A game definition MAY enable timeline mode and supply a timeline config (cards, devices, debug flag, rewrite/jump limits). When timeline mode is enabled, `createInitialState` SHALL build an epoch-rooted timeline, a numbered primary branch mat without crystals, a traveler at epoch, and a player mat. When `seedCardIds` is empty or omitted, the only timeline node SHALL be epoch (Origin).

#### Scenario: Initial timeline starts at epoch
- **WHEN** a timeline-mode definition is initialized
- **THEN** the traveler occupies the epoch node, branch 1 exists, and the player mat tracks parts, minerals, and crystals

#### Scenario: Empty seed is only Origin
- **WHEN** a timeline is created with no seed card ids
- **THEN** the only node is epoch and it is the Prime head
