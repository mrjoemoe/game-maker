# template-prototype-model Specification

## Purpose

Defines how reusable templates relate to named game prototypes so multiple configurable game versions can coexist without forking template source.
## Requirements
### Requirement: Templates hold reusable source
The repository SHALL keep reusable tile-board template source and documentation under `templates/<template-id>/`. New playable games MUST NOT be created by copying template source into a one-off fork when a prototype config is sufficient.

#### Scenario: Template directory exists for tile-board
- **WHEN** a developer inspects `templates/`
- **THEN** a `tile-board` template is present with documentation describing how prototypes bind to it

### Requirement: Prototypes are named game versions
Each playable game version SHALL live under `prototypes/<prototype-id>/` and SHALL include a game config that names the game, selects a template, defines tile/piece content, and declares feature flags.

#### Scenario: Prototype loads distinct display name
- **WHEN** a prototype config sets a display name different from the template id
- **THEN** the playtest UI shows that prototype display name

### Requirement: Config controls flip capability
A prototype config SHALL be able to enable or disable tile flipping. When disabled, flip actions MUST NOT change tile face state.

#### Scenario: Flip disabled
- **WHEN** a prototype sets tile flip to disabled and a flip action is requested
- **THEN** tile face states remain unchanged

### Requirement: Optional prototype extensions
A prototype MAY include an `extensions/` directory for prototype-unique code. The absence of extensions MUST still allow the prototype to run on the selected template.

#### Scenario: Prototype without extensions runs
- **WHEN** a prototype has a valid config and no extensions
- **THEN** the playtest app launches that prototype successfully

### Requirement: Simultaneous prototype launches
The development tooling SHALL allow launching more than one prototype at a time by selecting a prototype id and a host port.

#### Scenario: Two prototypes on different ports
- **WHEN** the developer starts prototype A on port 5173 and prototype B on port 5174
- **THEN** both playtest instances are reachable on their respective localhost ports

### Requirement: Config enables run mode
A prototype config SHALL be able to enable run mode and declare a run setup (hero piece, start position, max HP, base attack) plus optional items. When run mode is enabled, the playtest app SHALL present run-based interaction instead of free move/flip.

#### Scenario: Prototype enables run mode
- **WHEN** a prototype sets run mode enabled with a hero start position and max HP
- **THEN** the playtest app starts a run for that hero and shows run status

#### Scenario: Run mode is opt-in
- **WHEN** a prototype omits run mode
- **THEN** the prototype behaves as a normal flip/move tile-board game

### Requirement: Goblin Woods rough tiles declare pass items
The Goblin Woods prototype SHALL assign a pass item to each rough terrain tile type (pit, river, thicket, snare, goblin, brute, villain, castle) and SHALL leave sword/shield cache tiles without a pass item. The prototype item list SHALL include those pass items (reusing Sword where applicable). The castle’s pass item SHALL be the sledgehammer.

#### Scenario: Pit requires makeshift bridge
- **WHEN** the Goblin Woods definition is loaded
- **THEN** the pit tile type's `passItemId` is the makeshift-bridge item

#### Scenario: Castle requires sledgehammer
- **WHEN** the Goblin Woods definition is loaded
- **THEN** the castle tile type's `passItemId` is the sledgehammer item

### Requirement: Goblin Woods Mage first tile
The Goblin Woods hero start cell SHALL be a Mage tile (revealed at run start). The prototype SHALL include a sledgehammer item with `breaksSideWalls` available from the Mage item list. A separate Mage north of start is not required.

#### Scenario: Mage sits north of start
- **WHEN** the Goblin Woods board is loaded
- **THEN** the start position itself is the Mage tile (the opening tile the hero occupies)

#### Scenario: Start cell is Mage
- **WHEN** the Goblin Woods board is loaded
- **THEN** the start position’s tile type is Mage

### Requirement: Prototype rulebook file
Run-mode prototypes that expose player-facing rules SHALL keep a `RULEBOOK.md` under `prototypes/<prototype-id>/` and MAY export that markdown via prototype extensions for the playtest UI.

#### Scenario: Goblin Woods has a rulebook
- **WHEN** an agent inspects `prototypes/goblin-woods/`
- **THEN** a `RULEBOOK.md` describing current Goblin Woods rules is present

### Requirement: Goblin Woods corner extraction
The Goblin Woods board SHALL place extraction tiles on all four corner cells. Those corners SHALL be face up at run start and SHALL remain extraction points for the life of the map.

#### Scenario: Four corners are extraction
- **WHEN** the Goblin Woods board is loaded
- **THEN** cells (0,0), (width-1,0), (0,height-1), and (width-1,height-1) are extraction tiles and face up

### Requirement: Goblin Woods random castle
The Goblin Woods board SHALL place exactly one castle (goal) tile at a randomly chosen eligible cell that is not the hero start and not a corner extraction cell. That castle cell SHALL have side walls on all four sides. The castle SHALL NOT be fixed to a single hardcoded coordinate across new maps.

#### Scenario: Castle not on start or corner
- **WHEN** the Goblin Woods board is loaded
- **THEN** exactly one cell has the castle type, and that cell is neither the start position nor a corner

#### Scenario: New map can move the castle
- **WHEN** the player starts a new map after a full reset
- **THEN** the castle cell may differ from the previous map’s castle cell (random placement)

#### Scenario: Castle is fully walled
- **WHEN** the Goblin Woods board is loaded
- **THEN** the castle cell has side walls on north, east, south, and west

### Requirement: Goblin Woods random content layout
Aside from the start Mage and four corner extraction tiles, Goblin Woods hazard, enemy, forest, cache, and castle tiles SHALL be placed via seeded random placements. A full reset / New map SHALL re-roll the board seed so those placements and side walls can differ from the previous map.

#### Scenario: New map changes content layout
- **WHEN** the player activates New map on Goblin Woods
- **THEN** the new board is built with a new seed and content cell coordinates are not required to match the previous map

#### Scenario: Fixed anchors remain
- **WHEN** a Goblin Woods map is created
- **THEN** the start cell is Mage and the four corners are extraction

### Requirement: Goblin Woods shops and coin weights
Goblin Woods SHALL enable coin weights 40/30/20/10 for 0/1/2/3 coins and SHALL place exactly three shop tiles on random meadow cells (excluding start and corners). The prototype rulebook SHALL describe coins and shop buying.

#### Scenario: Three shops on the map
- **WHEN** the Goblin Woods board is loaded
- **THEN** exactly three cells have the shop type

