## MODIFIED Requirements

### Requirement: Merger joins two branches
Merger SHALL join the **head of the incoming branch** to the **head of a different destination branch**. Clicking any node on a branch SHALL use that branch’s head. The incoming branch SHALL end there. The destination head SHALL remain a head so that branch MAY still grow. Merger SHALL NOT create a third branch, a confluence node, or an extra parent on the destination card. Playing or forking from a merged branch SHALL be refused.

#### Scenario: Merge two heads
- **WHEN** Merger is applied from branch A onto a node of branch B
- **THEN** A is marked merged into B’s head, B’s head is still a head, A’s head is not a head, no new branch exists, and the traveler occupies B’s head

#### Scenario: Merge snaps to destination head
- **WHEN** Merger is applied onto a non-head card of branch B
- **THEN** the join target is B’s current head

#### Scenario: Ended branch cannot grow
- **WHEN** a card is played onto a node of a merged branch
- **THEN** the play is refused and no new node is created
