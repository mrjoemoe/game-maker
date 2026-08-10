## ADDED Requirements

### Requirement: Action-then-move program steps
A run program SHALL consist of exactly `programLength` steps, each pairing a program action with an orthogonal move. Each step SHALL apply the action first, then the move. If the action is invalid for the current situation, the run SHALL be lost with a reported reason and the move SHALL not apply.

#### Scenario: Take from Mage while standing on Mage
- **WHEN** the hero is on an unresolved Mage and the step action is takeFromMage with a valid item id
- **THEN** the item is granted and discovered, the Mage is resolved, and the move proceeds

#### Scenario: Take from Mage off a Mage tile fails
- **WHEN** the hero is not on an unresolved Mage and the step action is takeFromMage
- **THEN** the run is lost and the hero does not move

#### Scenario: Use pass item then enter matching tile
- **WHEN** the hero holds an item, uses it as the step action, and moves onto a tile whose passItemId is that item
- **THEN** the hero traverses that tile (goal wins) instead of pathing over

#### Scenario: Use item that does not match the destination fails
- **WHEN** the hero uses an item whose pass/break effect does not apply to the upcoming move
- **THEN** the run is lost before or without a successful traverse

### Requirement: Sledgehammer breaks side walls
An item MAY declare `breaksSideWalls`. Using that item as a step action SHALL clear side walls on the edge being crossed when that crossing is blocked; using it when the crossing is not blocked SHALL fail the run.

#### Scenario: Sledgehammer clears a blocked crossing
- **WHEN** the hero uses a breaksSideWalls item and the upcoming move is blocked by a side wall
- **THEN** those walls are cleared and the move proceeds

## MODIFIED Requirements

### Requirement: Mage grants a chosen item
Mage tiles SHALL NOT open an interactive pending choice on step. Granting SHALL occur only via a `takeFromMage` program action while standing on an unresolved Mage. Stepping onto a Mage tile SHALL be a safe move. Soft reset SHALL preserve Mage resolved state and re-seed inventory from discovered items.

#### Scenario: First visit to Mage opens a choice
- **WHEN** the hero stands on an unresolved Mage and programs takeFromMage
- **THEN** choosing an item via that action grants it (no modal pending choice)

#### Scenario: Choosing an item grants and persists it
- **WHEN** takeFromMage succeeds for an item id
- **THEN** that item is in inventory and discoveredItemIds and the Mage cell is resolved

#### Scenario: Soft reset keeps discovered gear
- **WHEN** a soft reset runs after an item was granted by the Mage
- **THEN** the new attempt’s inventory includes that item and the Mage remains resolved

#### Scenario: Stepping onto Mage does not pause for a picker
- **WHEN** the hero moves onto an unresolved Mage without a takeFromMage action on that step
- **THEN** the hero arrives on the Mage, the run stays playing, and no pending item choice is set
