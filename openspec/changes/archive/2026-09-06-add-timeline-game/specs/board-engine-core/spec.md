## ADDED Requirements

### Requirement: Timeline mode on the game definition
A game definition MAY enable timeline mode and supply a timeline config (cards, devices, debug flag, rewrite/jump limits). When timeline mode is enabled, `createInitialState` SHALL build an epoch-rooted timeline, a numbered primary branch mat without crystals, a traveler at epoch, and a player mat.

#### Scenario: Initial timeline starts at epoch
- **WHEN** a timeline-mode definition is initialized
- **THEN** the traveler occupies the epoch node, branch 1 exists, and the player mat tracks parts, minerals, and crystals

### Requirement: Debug skips timeline constraints
When timeline debug mode is enabled, the engine SHALL allow drawing any configured deck, playing any held card, taking crystals, and using any device without checking resource, society, blueprint, device-slot, hand-size, or branch-length requirements.

#### Scenario: Device used without resources in debug
- **WHEN** debug mode is on and Brancher is used from a node
- **THEN** a new branch is created even if the traveler has zero minerals, parts, crystals, and society

### Requirement: Place cards to extend or fork time
Playing a card onto a branch head SHALL append a new revealed node on that branch. Playing a card onto a non-head node SHALL fork a new branch from that node, place a branch mat with 1 crystal, and grant the player 1 crystal.

#### Scenario: Play at head appends
- **WHEN** a card is played on a branch head
- **THEN** that branch’s head becomes a new node holding the card and the traveler moves there

#### Scenario: Play off-head forks
- **WHEN** a card is played on a node that is not a branch head
- **THEN** a new branch is created from that node with a branch mat and the card on its first node

### Requirement: Traveler can move through time
The engine SHALL support moving the traveler to another existing node, including stepping toward the current branch head or toward epoch. Moving onto a node SHALL resolve that node’s card (resource gains apply to the player mat). Passing a fork branch mat with remaining crystals MAY take one crystal.

#### Scenario: Step forward along a branch
- **WHEN** a step-forward action is applied and the traveler is not at the branch head
- **THEN** the traveler occupies the next node toward that head

### Requirement: Brancher creates a timeline
Brancher SHALL create a new branch forking from a chosen node, add a branch mat with 1 crystal, grant the player 1 crystal, and move the traveler to the new branch node. Total branches SHALL not exceed 12 when debug is off.

#### Scenario: Branch from a mid-timeline node
- **WHEN** Brancher is applied to a node that already has a continuation
- **THEN** that node gains an additional child on a new numbered branch and the traveler moves to the new branch node

### Requirement: Reverser goes back in time
Reverser SHALL move the traveler to a chosen ancestor node (on the path from the traveler to epoch).

#### Scenario: Jump to an ancestor
- **WHEN** Reverser is applied with a node that is an ancestor of the traveler
- **THEN** the traveler occupies that ancestor

### Requirement: Relocator moves a branch
Relocator SHALL re-parent a forked branch onto a different node, refusing the edit when it would create a cycle or when the branch is preserved (unless debug is on).

#### Scenario: Relocate fork to another node
- **WHEN** Relocator moves branch B from its current fork parent to a node outside B’s subtree
- **THEN** B’s root is a child of the new parent and no longer a child of the old parent

### Requirement: Pruner deletes a branch
Pruner SHALL delete a non-primary branch and descendant forks, return placed event/action cards to the matching draw piles, and move the traveler to the fork parent if they were on a deleted node. Epoch SHALL NOT be deleted.

#### Scenario: Prune returns cards
- **WHEN** a branch containing an event card is pruned
- **THEN** that event card id is in a draw pile and the branch’s nodes no longer exist

### Requirement: Merger joins two branches
Merger SHALL join two distinct branch heads into a new node that has both heads as parents, creating a new continuation branch.

#### Scenario: Merge two heads
- **WHEN** Merger is applied to two different branches
- **THEN** a new node exists whose parents are those branches’ heads and the traveler occupies the new node

### Requirement: Rewriter replaces a played card
Rewriter SHALL replace one already-played action card on a chosen node, returning the replaced card to the matching draw pile.

#### Scenario: Rewrite swaps a card
- **WHEN** Rewriter replaces the card on a node with another catalog card
- **THEN** the node shows the new card and the old card id is in a draw pile

### Requirement: Preserver locks a timeline
Preserver SHALL mark a branch as preserved. Relocator, Pruner, Merger, and Rewriter SHALL refuse that branch while it is preserved unless debug mode is on.

#### Scenario: Preserve a branch
- **WHEN** Preserver is applied to a branch
- **THEN** that branch is marked preserved

### Requirement: Jumper skips ahead
Jumper SHALL move the traveler up to 3 nodes forward along the current branch toward its head.

#### Scenario: Jump two spaces
- **WHEN** Jumper is applied to a node two steps toward the head
- **THEN** the traveler occupies that node

### Requirement: Objectives complete on a held claim
A player MAY claim an objective when its person, place, and thing all exist on one continuous path. At the start of the player’s next turn, if the trio is still present, the objective is completed. Completing 3 objectives SHALL win.

#### Scenario: Claim holds until next turn
- **WHEN** the player claims an objective that is present and then starts their next turn with those three cards still on the same path
- **THEN** that objective is marked complete
