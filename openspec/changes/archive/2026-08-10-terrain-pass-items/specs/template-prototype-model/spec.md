## ADDED Requirements

### Requirement: Goblin Woods rough tiles declare pass items
The Goblin Woods prototype SHALL assign a pass item to each rough terrain tile type (pit, river, thicket, snare, goblin, brute, villain, castle) and SHALL leave sword/shield cache tiles without a pass item. The prototype item list SHALL include those pass items (reusing Sword where applicable).

#### Scenario: Pit requires makeshift bridge
- **WHEN** the Goblin Woods definition is loaded
- **THEN** the pit tile type's `passItemId` is the makeshift-bridge item
