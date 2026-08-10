## MODIFIED Requirements

### Requirement: Goblin Woods rough tiles declare pass items
The Goblin Woods prototype SHALL assign a pass item to each rough terrain tile type (pit, river, thicket, snare, goblin, brute, villain, castle). The prototype SHALL NOT include sword-cache or shield-cache tile types. The prototype item list SHALL include those pass items (reusing Sword where applicable). The castle’s pass item SHALL be the sledgehammer.

#### Scenario: Pit requires makeshift bridge
- **WHEN** the Goblin Woods definition is loaded
- **THEN** the pit tile type's `passItemId` is the makeshift-bridge item

#### Scenario: Castle requires sledgehammer
- **WHEN** the Goblin Woods definition is loaded
- **THEN** the castle tile type's `passItemId` is the sledgehammer item

#### Scenario: No gear caches
- **WHEN** the Goblin Woods definition is loaded
- **THEN** no tile type id is sword-cache or shield-cache

### Requirement: Goblin Woods random content layout
Aside from the start Mage and four corner extraction tiles, Goblin Woods hazard, enemy, forest, shop, and castle tiles SHALL be placed via seeded random placements. A full reset / New map SHALL re-roll the board seed so those placements and side walls can differ from the previous map. Goblin Woods SHALL place eight forest tiles and SHALL NOT place sword or shield caches.

#### Scenario: New map changes content layout
- **WHEN** the player activates New map on Goblin Woods
- **THEN** the new board is built with a new seed and content cell coordinates are not required to match the previous map

#### Scenario: Fixed anchors remain
- **WHEN** a Goblin Woods map is created
- **THEN** the start cell is Mage and the four corners are extraction

#### Scenario: Eight forests no caches
- **WHEN** the Goblin Woods board is loaded
- **THEN** exactly eight cells have the forest type and zero cells are sword-cache or shield-cache
