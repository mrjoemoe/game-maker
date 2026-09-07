## ADDED Requirements

### Requirement: Pruner highlights loose tails
While Pruner is armed, the Play tab SHALL highlight only nodes on a loose tail (head down to the latest junction), not every card.

#### Scenario: Only loose ends light up
- **WHEN** Pruner is armed and a side branch is loose
- **THEN** that branch’s tail cards are highlighted and a merged or junction-locked timeline is not
