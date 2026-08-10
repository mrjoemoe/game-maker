## ADDED Requirements

### Requirement: Goblin Woods random content layout
Aside from the start Mage and four corner extraction tiles, Goblin Woods hazard, enemy, forest, cache, and castle tiles SHALL be placed via seeded random placements. A full reset / New map SHALL re-roll the board seed so those placements and side walls can differ from the previous map.

#### Scenario: New map changes content layout
- **WHEN** the player activates New map on Goblin Woods
- **THEN** the new board is built with a new seed and content cell coordinates are not required to match the previous map

#### Scenario: Fixed anchors remain
- **WHEN** a Goblin Woods map is created
- **THEN** the start cell is Mage and the four corners are extraction
