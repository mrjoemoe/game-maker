## ADDED Requirements

### Requirement: Timeline Game starts at Origin
Timeline Game SHALL place no cards on Prime at setup except **Origin** (epoch). Ada, Paris, and other catalog events SHALL remain in the Omega pile until played.

#### Scenario: Only Origin is on the timestream
- **WHEN** Timeline Game is resolved from `core/timeline` and initialized
- **THEN** `seedCardIds` is empty and Prime’s head is epoch
