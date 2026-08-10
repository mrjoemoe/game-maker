## ADDED Requirements

### Requirement: Mage grants a chosen item
A tile type MAY declare effect kind `mage`. Stepping onto an unresolved Mage tile SHALL reveal it, move the hero onto it, keep the run playing, and set a pending item choice for that cell. While a choice is pending, further steps SHALL be no-ops. Choosing an item from the game’s item registry SHALL add it to inventory and discovered items, mark the Mage cell resolved, and clear the pending choice. Stepping onto a resolved Mage SHALL move the hero and keep the run playing (safe pass-through). Soft reset SHALL preserve Mage resolved state and re-seed inventory from discovered items.

#### Scenario: First visit to Mage opens a choice
- **WHEN** the hero steps onto an unresolved Mage tile
- **THEN** the hero is on that tile, the run stays playing, and a pending item choice is set

#### Scenario: Choosing an item grants and persists it
- **WHEN** the player chooses an item while a Mage choice is pending
- **THEN** that item is in inventory and discoveredItemIds, the Mage cell is resolved, and the pending choice is cleared

#### Scenario: Soft reset keeps discovered gear
- **WHEN** a soft reset runs after an item was granted by the Mage
- **THEN** the new attempt’s inventory includes that item and the Mage remains resolved
