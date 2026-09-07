## MODIFIED Requirements

### Requirement: Brancher creates a timeline
Brancher SHALL create a new branch forking from a chosen node, **place a chosen action card from the player’s hand as that branch’s first card**, add a branch mat with 1 crystal, grant the player 1 crystal, and move the traveler to the new branch node. Brancher SHALL NOT create an empty rift node. Total branches SHALL not exceed 12 when debug is off.

#### Scenario: Branch from a mid-timeline node
- **WHEN** Brancher is applied to a node that already has a continuation, with an action card from hand
- **THEN** that node gains an additional child on a new numbered branch, the new node holds that action card, the card leaves the hand, and the traveler moves to the new branch node

#### Scenario: Brancher without a card does nothing
- **WHEN** Brancher is applied without a valid action card in hand
- **THEN** no new branch is created
