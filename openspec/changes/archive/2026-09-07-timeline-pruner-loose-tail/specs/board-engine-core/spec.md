## MODIFIED Requirements

### Requirement: Pruner deletes a branch
Pruner SHALL cut only a **loose tail**: cards from the branch head down to, but not including, the latest junction on that walk. A junction is a fork, a merge-in, or a preserved card. The traveler SHALL move to that junction (or the fork parent if the whole side branch is removed). Epoch SHALL NOT be deleted. A branch whose head has already merged SHALL NOT be pruned. A side branch with no internal junction SHALL be removed entirely and its cards returned to the matching piles.

#### Scenario: Prune returns cards
- **WHEN** a loose side branch containing an action card is pruned
- **THEN** that card id is in a draw pile and the branch’s nodes no longer exist

#### Scenario: Tail stops at a junction
- **WHEN** Prime has a fork from a mid-path card and Pruner is used on Prime
- **THEN** cards above that fork are returned and the fork card remains as Prime’s head

#### Scenario: Merged branch is not loose
- **WHEN** a branch has merged into another timeline’s head
- **THEN** Pruner refuses that branch

### Requirement: Preserver locks a timeline
Preserver SHALL lock the cards already laid on the chosen branch **up to and including the clicked card**. Cards played on that branch after the lock SHALL NOT be preserved. Relocator SHALL refuse a branch that has a preserved prefix unless debug mode is on. Pruner SHALL NOT remove preserved cards; it MAY cut an unpreserved loose tail above the lock. Rewriter SHALL refuse a preserved card unless debug mode is on. Playing a new card at the current head SHALL still be allowed.

#### Scenario: Preserve a branch
- **WHEN** Preserver is applied to a card on a branch
- **THEN** that branch records a preserved through-card

#### Scenario: Preserve a prefix
- **WHEN** Preserver is applied to a card on a branch
- **THEN** that card and earlier cards on the same branch are preserved, and the branch records that through-card

#### Scenario: Later cards stay unlocked
- **WHEN** a branch is preserved through a mid-path card and then a card is played at the head
- **THEN** the new card is not preserved
