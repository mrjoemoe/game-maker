## MODIFIED Requirements

### Requirement: Debug skips timeline constraints
When timeline debug mode is enabled, the engine SHALL allow drawing from the action pile, playing any held card, taking crystals, and using any device without checking resource, society, blueprint, device-slot, hand-size, or branch-length requirements. The engine SHALL maintain separate **Omega**, **action**, and **blueprint** piles. Using a slotted device SHALL still spend a use token so remaining uses stay visible.

#### Scenario: Device used without resources in debug
- **WHEN** debug mode is on and Brancher is used from a node
- **THEN** a new branch is created even if the traveler has zero minerals, parts, crystals, and society

#### Scenario: Draw uses the action pile
- **WHEN** a draw action is applied
- **THEN** the top action-pile card moves into the hand

#### Scenario: Slotted device spends a use
- **WHEN** debug mode is on, a Brancher is in a device slot, and Brancher is used successfully
- **THEN** that slot’s remaining uses decrease by one
