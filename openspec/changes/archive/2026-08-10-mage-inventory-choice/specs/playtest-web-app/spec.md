## ADDED Requirements

### Requirement: Side inventory panel
When run mode is enabled, the playtest app SHALL show a side inventory panel listing the hero’s current items (or an empty state). The panel SHALL update when items are granted.

#### Scenario: Empty inventory on new map
- **WHEN** a new Goblin Woods map starts
- **THEN** the side inventory shows that no gear is held yet

### Requirement: Mage item picker
When the run has a pending Mage item choice, the playtest app SHALL show a picker listing every item in the game definition and SHALL dispatch the chosen item. Path execution SHALL stop when a Mage choice becomes pending.

#### Scenario: Picker appears on Mage
- **WHEN** the hero steps onto an unresolved Mage
- **THEN** an item picker is shown and the programmed path does not continue until after a choice
