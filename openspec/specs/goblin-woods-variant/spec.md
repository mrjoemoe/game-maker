# goblin-woods-variant Specification

## Purpose

Owns Goblin Woods–specific gameplay requirements composed from the game component library.

## Requirements

### Requirement: Goblin Woods rough tiles declare pass items
The Goblin Woods variant SHALL assign a pass item to each rough terrain tile type (pit, river, thicket, snare, goblin, brute, villain, castle). The variant SHALL NOT include sword-cache or shield-cache tile types. Its item composition SHALL include those pass items, reusing canonical library components where applicable. The castle's pass item SHALL be the sledgehammer.

#### Scenario: Pit requires makeshift bridge
- **WHEN** the Goblin Woods variant is resolved
- **THEN** the pit tile type's `passItemId` is the makeshift-bridge item

#### Scenario: Castle requires sledgehammer
- **WHEN** the Goblin Woods variant is resolved
- **THEN** the castle tile type's `passItemId` is the sledgehammer

#### Scenario: No gear caches
- **WHEN** the Goblin Woods variant is resolved
- **THEN** no tile type id is sword-cache or shield-cache

### Requirement: Goblin Woods Mage first tile
The Goblin Woods hero start cell SHALL be a Mage tile revealed at run start. The variant SHALL compose a sledgehammer item with `breaksSideWalls` available from the Mage item list. A separate Mage north of start is not required.

#### Scenario: Start cell is Mage
- **WHEN** the Goblin Woods board is resolved
- **THEN** the start position itself is the Mage tile the hero occupies

### Requirement: Goblin Woods variant rulebook
The Goblin Woods variant SHALL expose a `RULEBOOK.md` under its variant directory and SHALL keep it synchronized with player-facing canonical component documentation and variant-specific overrides.

#### Scenario: Goblin Woods has a rulebook
- **WHEN** an agent changes a player-facing component or override consumed by Goblin Woods
- **THEN** the Goblin Woods rulebook is checked and updated in the same change

### Requirement: Goblin Woods corner extraction
The Goblin Woods board SHALL place extraction tiles on all four corner cells. Those corners SHALL be face up at run start and SHALL remain extraction points for the life of the map.

#### Scenario: Four corners are extraction
- **WHEN** the Goblin Woods board is resolved
- **THEN** cells (0,0), (width-1,0), (0,height-1), and (width-1,height-1) are extraction tiles and face up

### Requirement: Goblin Woods random castle
The Goblin Woods board SHALL place exactly one castle goal tile at a randomly chosen eligible cell that is not the hero start and not a corner extraction cell. That castle cell SHALL have side walls on all four sides. The castle SHALL NOT be fixed to a single hardcoded coordinate across new maps.

#### Scenario: Castle not on start or corner
- **WHEN** the Goblin Woods board is resolved
- **THEN** exactly one cell has the castle type, and that cell is neither the start position nor a corner

#### Scenario: New map can move the castle
- **WHEN** the player starts a new map after a full reset
- **THEN** the castle cell may differ from the previous map's castle cell

#### Scenario: Castle is fully walled
- **WHEN** the Goblin Woods board is resolved
- **THEN** the castle cell has side walls on north, east, south, and west

### Requirement: Goblin Woods random content layout
Aside from the start Mage and four corner extraction tiles, Goblin Woods hazard, enemy, forest, shop, portal, and castle tiles SHALL be placed through seeded random placement components. A full reset or New map SHALL re-roll the board seed so those placements and side walls can differ from the previous map. Goblin Woods SHALL place eight forest tiles and SHALL NOT place sword or shield caches.

#### Scenario: New map changes content layout
- **WHEN** the player activates New map on Goblin Woods
- **THEN** the new board is built with a new seed and content cell coordinates are not required to match the previous map

#### Scenario: Fixed anchors remain
- **WHEN** a Goblin Woods map is created
- **THEN** the start cell is Mage and the four corners are extraction

#### Scenario: Eight forests no caches
- **WHEN** the Goblin Woods board is resolved
- **THEN** exactly eight cells have the forest type and zero cells are sword-cache or shield-cache

### Requirement: Goblin Woods shops and coin weights
Goblin Woods SHALL enable coin weights 40/30/20/10 for 0/1/2/3 coins and SHALL place exactly three shop tiles on random meadow cells excluding start and corners. The variant rulebook SHALL describe coins and shop buying.

#### Scenario: Three shops on the map
- **WHEN** the Goblin Woods board is resolved
- **THEN** exactly three cells have the shop type

### Requirement: Goblin Woods portals
Goblin Woods SHALL place exactly four portal tiles (Portal 1–4) on random meadow cells excluding start and corners. The variant rulebook SHALL describe portal travel.

#### Scenario: Four numbered portals
- **WHEN** the Goblin Woods board is resolved
- **THEN** exactly one cell of each portal-1 through portal-4 type exists

### Requirement: Rulebook explains pass items versus side walls
The Goblin Woods rulebook SHALL state that Using the matching pass item lets the hero enter that tile even when the destination has a rim wall, while walls on the hero's current tile still need a Sledgehammer.

#### Scenario: Rulebook covers walled pass tiles
- **WHEN** a player reads the pass-items or side-walls section
- **THEN** the distinction between destination rim walls (pass item) and origin walls (sledgehammer) is clear
