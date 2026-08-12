## ADDED Requirements

### Requirement: Matching pass item bypasses destination entry walls
When a program step Uses an item whose id matches the destination tile's `passItemId`, the engine SHALL allow that crossing even if the destination tile has a side wall on the entry face. Exit walls on the origin tile SHALL still block unless the used item breaks side walls.

#### Scenario: Makeshift Bridge into a walled pit
- **WHEN** the hero Uses makeshift-bridge while moving onto a pit that has a wall on the entry face
- **THEN** the hero moves onto the pit, the pass item is consumed, and the run stays playing

#### Scenario: Origin wall still blocks a pass item
- **WHEN** the hero Uses a matching pass item but the origin tile has a wall on the exit face
- **THEN** the path ends without peeking at or entering the destination
