## MODIFIED Requirements

### Requirement: Debug skips timeline constraints
When timeline debug mode is enabled, the engine SHALL allow drawing from the action pile, playing any held card, taking crystals, and using any device without checking resource, society, blueprint, device-slot, hand-size, or branch-length requirements. The engine SHALL maintain separate **Omega**, **action**, and **blueprint** piles.

#### Scenario: Device used without resources in debug
- **WHEN** debug mode is on and Brancher is used from a node
- **THEN** a new branch is created even if the traveler has zero minerals, parts, crystals, and society

#### Scenario: Draw uses the action pile
- **WHEN** a draw action is applied
- **THEN** the top action-pile card moves into the hand

### Requirement: Place cards to extend or fork time
Playing a card onto a branch head SHALL append a new revealed node on that branch. Playing a card onto a non-head node SHALL fork a new branch from that node, place a branch mat with 1 crystal, and grant the player 1 crystal. Playing a **Random Event** action SHALL instead place the top **Omega** event from that pile onto the chosen moment.

#### Scenario: Play at head appends
- **WHEN** a card is played on a branch head
- **THEN** that branch’s head becomes a new node holding the card and the traveler moves there

#### Scenario: Play off-head forks
- **WHEN** a card is played on a node that is not a branch head
- **THEN** a new branch is created from that node with a branch mat and the card on its first node

#### Scenario: Random Event draws Omega onto the timeline
- **WHEN** Random Event is played on a node
- **THEN** that node’s new card is the top Omega event, not the Random Event action

### Requirement: Rewriter replaces a played card
Rewriter SHALL swap one already-played card on a chosen timeline node with one card from the player’s hand. The timeline card SHALL move into the hand and the hand card SHALL occupy that node. Rewriter SHALL NOT return cards to a draw pile or pick a replacement from the catalog. Rewriter SHALL refuse the swap when either card is an Omega event.

#### Scenario: Rewrite swaps a card
- **WHEN** Rewriter is applied with a timeline node that has a card and a card instance from hand
- **THEN** the node shows the former hand card and that former timeline card is in the hand

#### Scenario: Rewrite refuses Omega
- **WHEN** Rewriter is applied with an Omega event in hand or on the chosen node
- **THEN** the swap does not occur
