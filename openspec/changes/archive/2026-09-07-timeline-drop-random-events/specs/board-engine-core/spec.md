## MODIFIED Requirements

### Requirement: Debug skips timeline constraints
When timeline debug mode is enabled, the engine SHALL allow drawing from the action deck, playing any held card, taking crystals, and using any device without checking resource, society, blueprint, device-slot, hand-size, or branch-length requirements. The engine SHALL NOT maintain a separate random-event deck.

#### Scenario: Device used without resources in debug
- **WHEN** debug mode is on and Brancher is used from a node
- **THEN** a new branch is created even if the traveler has zero minerals, parts, crystals, and society

#### Scenario: Draw uses the action pile
- **WHEN** a draw action is applied
- **THEN** the top action-deck card moves into the hand and no random-event pile is consulted
