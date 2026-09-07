## MODIFIED Requirements

### Requirement: Preserver locks a timeline
Preserver SHALL lock the cards already laid on the chosen branch **up to and including the clicked card**. Cards played on that branch after the lock SHALL NOT be preserved. Relocator and Pruner SHALL refuse a branch that has a preserved prefix unless debug mode is on. Rewriter SHALL refuse a preserved card unless debug mode is on. Playing a new card at the current head SHALL still be allowed.

#### Scenario: Preserve a branch
- **WHEN** Preserver is applied to a card on a branch
- **THEN** that branch records a preserved through-card

#### Scenario: Preserve a prefix
- **WHEN** Preserver is applied to a card on a branch
- **THEN** that card and earlier cards on the same branch are preserved, and the branch records that through-card

#### Scenario: Later cards stay unlocked
- **WHEN** a branch is preserved through a mid-path card and then a card is played at the head
- **THEN** the new card is not preserved

### Requirement: Relocator moves a branch
Relocator SHALL re-parent a forked branch onto a different node, refusing the edit when it would create a cycle or when the branch has a preserved prefix (unless debug is on).

#### Scenario: Relocate fork to another node
- **WHEN** Relocator moves branch B from its current fork parent to a node outside B’s subtree
- **THEN** B’s root is a child of the new parent and no longer a child of the old parent
