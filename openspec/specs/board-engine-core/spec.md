# board-engine-core Specification

## Purpose

Provides a headless, layered tile-board engine: configurable grid, tile types, face-up/face-down tile state, pieces, feature flags, and deterministic game-state actions for prototyping.
## Requirements
### Requirement: Configurable square grid
The engine SHALL support square grids whose width and height are defined by configuration, and SHALL expose coordinate bounds checking and orthogonal neighbor lookup for in-bounds cells.

#### Scenario: Create grid from config
- **WHEN** a game definition specifies grid width W and height H
- **THEN** the engine creates a grid of W×H cells with coordinates (x, y) where 0 ≤ x < W and 0 ≤ y < H

#### Scenario: Reject out-of-bounds coordinates
- **WHEN** a consumer asks whether a coordinate outside the grid is in bounds
- **THEN** the engine reports that the coordinate is not in bounds

### Requirement: Configurable tile type registry
The engine SHALL allow a game definition to register one or more tile types, each with a stable id and display metadata (at least label and color).

#### Scenario: Resolve tile type by id
- **WHEN** a tile state references a registered tile type id
- **THEN** the engine can resolve that id to the registered tile type definition

### Requirement: Tile face-up and face-down state
Each board cell SHALL have a tile state that includes a tile type id and a face-up/face-down flag. The engine SHALL provide an action to flip a tile between face-up and face-down.

#### Scenario: Flip a face-down tile
- **WHEN** a flip action is applied to a cell whose tile is face-down
- **THEN** that tile becomes face-up

#### Scenario: Flip a face-up tile
- **WHEN** a flip action is applied to a cell whose tile is face-up
- **THEN** that tile becomes face-down

### Requirement: Board generation from config
The engine SHALL generate an initial board from a game definition that includes a default tile type for all cells and optional per-coordinate overrides for type and initial face state.

#### Scenario: Default tile type fills the board
- **WHEN** a board is generated with default tile type T and no overrides
- **THEN** every cell has tile type T

#### Scenario: Per-cell override applied
- **WHEN** a board is generated with an override at coordinate C for tile type U
- **THEN** cell C has tile type U and all other cells keep the default type

### Requirement: Configurable pieces and movement
The engine SHALL support configurable piece types and piece instances with positions on the board. The engine SHALL provide a move action that relocates a piece to an in-bounds destination. Occupancy and capture rules are not required in this capability.

#### Scenario: Move piece within bounds
- **WHEN** a move action targets an existing piece and an in-bounds destination
- **THEN** the piece's position becomes the destination

#### Scenario: Reject move out of bounds
- **WHEN** a move action targets a destination outside the grid
- **THEN** the engine rejects the move and leaves piece positions unchanged

### Requirement: Reset to initial definition
The engine SHALL provide a reset action that restores board tile states and piece positions to the values derived from the original game definition.

#### Scenario: Reset after play
- **WHEN** tiles have been flipped and pieces moved, and a reset action is applied
- **THEN** tile face states and piece positions match the initial configuration again

### Requirement: Feature flags on game definition
A game definition SHALL include feature flags that at least support enabling or disabling tile flipping.

#### Scenario: Definition declares flip disabled
- **WHEN** a game definition sets tile flip to false
- **THEN** consumers can read that flag from the definition

### Requirement: Flip respects feature flag
When tile flipping is disabled on the active definition, applying a flip action SHALL leave tile face states unchanged.

#### Scenario: Flip action ignored when disabled
- **WHEN** tile flip is disabled and a flipTile action is applied
- **THEN** the targeted tile's face state is unchanged

### Requirement: Tile effects
A tile type MAY declare an effect that resolves when a hero steps onto a cell of that type. Supported effects SHALL include: none/empty, wall (impassable), trap (damage), enemy (combat), powerup (grants an item), mage (choose one item), goal (win), and extraction (bank inventory and end the attempt as extracted).

#### Scenario: Tile type declares an effect
- **WHEN** a tile type is defined with an enemy effect of power P and damage D
- **THEN** the engine can resolve that tile type to its effect kind and parameters

#### Scenario: Tile without an effect is inert
- **WHEN** a hero steps onto a tile type with no effect
- **THEN** no damage, item, or status change occurs

### Requirement: Per-cell resolved state
Each board cell SHALL track whether its one-shot effect has been resolved so that enemies and power-ups fire only once per cell until reset.

#### Scenario: Power-up collected once
- **WHEN** a hero steps onto an unresolved powerup cell and then steps onto it again
- **THEN** the item is granted only on the first visit and the cell is marked resolved

### Requirement: Item registry
A game definition MAY declare items, each with a stable id and optional attack and max-HP bonuses. The engine SHALL aggregate an inventory's items into an effective attack and max-HP value.

#### Scenario: Aggregate inventory bonuses
- **WHEN** an inventory holds items whose attack bonuses sum to B on top of a base attack A
- **THEN** the engine reports effective attack A + B

### Requirement: Run state
When run mode is enabled, the game state SHALL include a run with status (playing, won, lost, or extracted), current and max HP, an inventory of item ids, and an attempt count, plus a persistent stash of item ids on the game state.

#### Scenario: Initial run state
- **WHEN** a run-mode game is created with max HP M
- **THEN** the run starts playing with HP M, an empty inventory, empty stash, and attempt count 1

### Requirement: Step action reveals and resolves tiles
The engine SHALL provide a step action that moves the hero to an in-bounds orthogonally adjacent cell and reveals that tile face up when the crossing is allowed. A step SHALL be a no-op when the run is not playing. Only empty-effect tiles (meadow/forest) are safe path tiles.

#### Scenario: Step onto an empty neighbor
- **WHEN** the hero steps onto an adjacent empty face-down tile
- **THEN** the hero moves there, the tile becomes face up, and the run stays playing

#### Scenario: Step into a full-cell wall
- **WHEN** the hero steps toward an adjacent full-cell wall tile
- **THEN** the wall tile becomes face up, the hero's position is unchanged, and the run is lost with a path-over message

#### Scenario: Step onto a non-empty hazard or goal
- **WHEN** the hero steps onto a trap, enemy, powerup, or goal tile
- **THEN** the hero moves onto that tile, the run is lost, and the bump message reports that the path is over because of that tile

### Requirement: Soft reset preserves learned map and items
The engine SHALL provide a soft reset action that returns the hero to the start position, restores HP to max, clears the run inventory without changing the stash, increments the attempt count, and clears enemy and Mage resolved flags, while preserving revealed tile faces, powerup resolved state, and stash contents. A full reset action SHALL clear the stash, rebuild the board, and return run state to the initial definition; when run mode is enabled and the board uses generated side walls, full reset SHALL re-roll the side-wall seed so the new map’s wall layout can differ.

#### Scenario: Retry after defeat keeps the map
- **WHEN** a run ends lost and a soft reset is applied
- **THEN** the hero returns to start with full HP, previously revealed tiles stay face up, the run inventory is empty, and the stash is unchanged from before that failed attempt’s loadout (items taken into the failed run remain lost)

#### Scenario: Full reset clears stash
- **WHEN** a full reset action is applied
- **THEN** tile faces, hero position, run state, and stash all return to the initial definition

#### Scenario: Full reset rerolls side walls in run mode
- **WHEN** a run-mode game with generated side walls is fully reset
- **THEN** the new board is built with a new side-wall seed (not necessarily the previous seed)

#### Scenario: Soft reset after extract keeps banked stash
- **WHEN** a run ends extracted with banked items and a soft reset is applied
- **THEN** those items remain in the stash and the run inventory is empty pending a new loadout

#### Scenario: Soft reset refreshes Mage
- **WHEN** a Mage was resolved in a prior attempt and a soft reset is applied
- **THEN** that Mage cell is unresolved again so takeFromMage can succeed on the new attempt

### Requirement: Programmed path length
A run-mode definition MAY set `programLength` (default 6) as the maximum number of steps in one program. The engine SHALL accept a `runProgram` with between 1 and `programLength` steps (inclusive) and SHALL stop applying further steps once the run is no longer playing. Empty programs and programs longer than `programLength` SHALL be rejected.

#### Scenario: Program stops after path-over
- **WHEN** a programmed step ends the run as lost
- **THEN** remaining steps in that program are not applied

#### Scenario: Short program is accepted
- **WHEN** a runProgram with fewer than `programLength` steps (but at least one) is applied
- **THEN** those steps execute in order without requiring the remaining slots

### Requirement: Side walls on tiles
Board cells MAY carry zero or more orthogonal side walls. Board config MAY generate side walls with weights favoring mostly none, some one-sided, and few two-sided walls in random orientations. Crossing a walled edge SHALL end the run as lost with a reported reason. When the block is on the hero’s current tile (exit side), the destination SHALL NOT be revealed. When the block is only on the destination’s entry side, the destination SHALL be revealed.

#### Scenario: Side wall ends the path
- **WHEN** the hero attempts to cross a side wall on the destination tile only
- **THEN** the destination tile is revealed, the hero does not move, and the run is lost with a wall path-over message

#### Scenario: Origin side wall does not reveal the next tile
- **WHEN** the hero attempts to leave through a side wall on their current tile
- **THEN** the destination stays face down, the hero does not move, and the run is lost with a this-tile wall path-over message

### Requirement: Safe path tiles only
In run mode, stepping onto a tile whose effect is not empty, mage, or extraction SHALL end the run as lost and report why (e.g. found a Castle — path over), unless that step’s action used the tile’s `passItemId`. Full-cell wall tiles without a matching used pass item SHALL reveal, keep the hero in place, and end the run as lost. Mage and extraction tiles are safe to step onto. Extraction banking requires a later extract action.

#### Scenario: Castle ends the path
- **WHEN** the hero steps onto a goal/castle tile without using its pass item that step
- **THEN** the run status becomes lost and the bump message states the castle ended the path

#### Scenario: Extraction does not path-over
- **WHEN** the hero steps onto an extraction tile
- **THEN** the run stays playing and does not become lost from that tile’s effect alone

### Requirement: Pass item traverses rough tiles
A tile type MAY declare `passItemId`. When the hero uses that item as the step action and then moves onto the matching tile, the engine SHALL treat the tile as traversable: reveal it, move the hero onto it, keep the run playing (goal wins and banks), and consume the used item from the run inventory. Merely holding the item without using it that step SHALL NOT bypass the hazard. Side-wall crossings SHALL NOT be cleared by pass items.

#### Scenario: Wall tile with pass item is crossed
- **WHEN** the hero uses a full-cell wall tile’s `passItemId` as the step action and moves onto that wall
- **THEN** the tile is revealed, the hero moves onto it, the run stays playing, and that item is removed from the run inventory

#### Scenario: Hazard without pass item still paths over
- **WHEN** the hero steps onto a trap or enemy tile without using that tile's `passItemId` that step
- **THEN** the hero moves onto the tile and the run is lost with a path-over message

#### Scenario: Goal with pass item wins
- **WHEN** the hero uses a goal tile’s `passItemId` as the step action and moves onto the goal
- **THEN** the hero moves onto the tile, the run status becomes won, remaining run inventory is banked into the stash, and the used pass item is consumed (not banked)

### Requirement: Mage grants a chosen item
Mage tiles SHALL NOT open an interactive pending choice on step. Granting SHALL occur only via a `takeFromMage` program action while standing on an unresolved Mage. Stepping onto a Mage tile SHALL be a safe move. Granted items SHALL enter the run inventory only; they SHALL NOT enter the stash until the hero extracts or wins. Soft reset SHALL clear Mage resolved state so each attempt can take from the Mage again. Within a single attempt, a successful take resolves the Mage until the next soft or full reset.

#### Scenario: First visit to Mage opens a choice
- **WHEN** the hero stands on an unresolved Mage and programs takeFromMage
- **THEN** choosing an item via that action grants it (no modal pending choice)

#### Scenario: Choosing an item grants to run inventory only
- **WHEN** takeFromMage succeeds for an item id
- **THEN** that item is in the run inventory, not in the stash, and the Mage cell is resolved

#### Scenario: Soft reset without extract loses Mage grant but refreshes Mage
- **WHEN** a soft reset runs after an item was granted by the Mage but the run did not extract or win
- **THEN** that item is not in the stash, the new attempt’s inventory does not include it unless loaded again from stash, and the Mage is unresolved again

#### Scenario: Stepping onto Mage does not pause for a picker
- **WHEN** the hero moves onto an unresolved Mage without a takeFromMage action on that step
- **THEN** the hero arrives on the Mage, the run stays playing, and no pending item choice is set

### Requirement: Action-then-move program steps
A run program SHALL consist of 1 to `programLength` steps, each pairing a program action with an orthogonal move. Each step SHALL apply the action first, then the move. If the action is invalid for the current situation, the run SHALL be lost with a reported reason and the move SHALL not apply. Successful `useItem` actions SHALL consume the item from the run inventory. A successful `extract` action SHALL end the run as extracted so the move does not apply.

#### Scenario: Take from Mage while standing on Mage
- **WHEN** the hero is on an unresolved Mage and the step action is takeFromMage with a valid item id
- **THEN** the item is granted to the run inventory, the Mage is resolved, and the move proceeds

#### Scenario: Take from Mage off a Mage tile fails
- **WHEN** the hero is not on an unresolved Mage and the step action is takeFromMage
- **THEN** the run is lost and the hero does not move

#### Scenario: Use pass item then enter matching tile
- **WHEN** the hero holds an item, uses it as the step action, and moves onto a tile whose passItemId is that item
- **THEN** the hero traverses that tile (goal wins and banks) instead of pathing over, and the item is consumed

#### Scenario: Use item that does not match the destination fails
- **WHEN** the hero uses an item whose pass/break effect does not apply to the upcoming move
- **THEN** the run is lost before or without a successful traverse

#### Scenario: Extract ends before the move
- **WHEN** the hero is on extraction and the step action is extract with any move
- **THEN** the run becomes extracted and the move is not applied

### Requirement: Sledgehammer breaks side walls
An item MAY declare `breaksSideWalls`. Using that item as a step action SHALL clear side walls on the edge being crossed when that crossing is blocked and SHALL consume the item from the run inventory after the move succeeds; using it when the crossing is not blocked SHALL fail the run.

#### Scenario: Sledgehammer clears a blocked crossing
- **WHEN** the hero uses a breaksSideWalls item and the upcoming move is blocked by a side wall
- **THEN** those walls are cleared, the move proceeds, and the item is removed from the run inventory

#### Scenario: Sledgehammer enters a walled goal
- **WHEN** the hero uses a breaksSideWalls item whose id is the goal’s passItemId and moves onto that goal through a blocked side wall
- **THEN** the walls are cleared, the hero wins, and the item is consumed (not banked)

### Requirement: Persistent stash and run loadout
When run mode is enabled, game state SHALL include a persistent `stashItemIds` list separate from the run inventory. A new map SHALL start with an empty stash and an empty run inventory. Committing a loadout SHALL move the selected item ids from the stash into the run inventory (they leave the stash immediately). Failing a run (status lost) SHALL discard the run inventory without returning those items to the stash. Soft reset SHALL NOT re-seed run inventory from the stash or from mid-run finds.

#### Scenario: New map has empty stash
- **WHEN** a run-mode game is created
- **THEN** stashItemIds is empty and the run inventory is empty

#### Scenario: Loadout removes items from stash
- **WHEN** the player commits a loadout containing item ids present in the stash
- **THEN** those ids are removed from the stash and present in the run inventory

#### Scenario: Failed run loses carried items
- **WHEN** a run ends lost while holding items in the run inventory
- **THEN** those items are not returned to the stash and the next soft-reset attempt starts with an empty run inventory until a new loadout is committed

### Requirement: Extraction banks run inventory
A tile type MAY declare effect kind `extraction`. Stepping onto an extraction tile SHALL be a safe move (like Mage): reveal if needed, move the hero onto it, and keep the run playing. Banking and ending as `extracted` SHALL occur only via the `extract` program action while standing on that tile. Extraction is not the win condition.

#### Scenario: Step onto extraction stays playing
- **WHEN** the hero steps onto an extraction tile without an extract action on that step
- **THEN** the hero arrives on the tile, the run stays playing, and the stash is unchanged

#### Scenario: Extract with gathered gear
- **WHEN** the hero stands on extraction and programs extract while holding items
- **THEN** those items are in the stash, the run inventory is empty, and the run status is extracted

#### Scenario: Extract empty-handed
- **WHEN** the hero stands on extraction and programs extract with an empty run inventory
- **THEN** the stash is unchanged and the run status is extracted

### Requirement: Win at goal banks run inventory
When the hero successfully wins at a goal tile (using its pass item as required), the engine SHALL merge the current run inventory into the stash, clear the run inventory, and set run status to won.

#### Scenario: Castle win banks gear
- **WHEN** the hero wins at the goal while holding items
- **THEN** those items are in the stash and the run status is won

### Requirement: Using an item consumes it
When a program step successfully applies a `useItem` action (including pass-item traversal and breaksSideWalls), the engine SHALL remove that item id from the run inventory before or as part of resolving the step. A failed use that ends the run as lost SHALL still remove the item if the action was accepted as held and spent, or SHALL fail without spending if the item was not in inventory (existing invalid-use rules). Successful consume-on-use SHALL leave the item out of both run inventory and stash unless later re-acquired and extracted.

#### Scenario: Pass item is spent on traverse
- **WHEN** the hero uses a pass item to traverse a matching rough tile
- **THEN** that item is no longer in the run inventory after the step

#### Scenario: Spent item is not in stash after extract
- **WHEN** the hero uses a knife to pass a snare, then extracts with remaining items
- **THEN** the knife is not in the stash

### Requirement: Corner extraction cells face up
When a board places extraction tiles on the four corner cells, those cells SHALL be face up at game creation and SHALL remain extraction tiles (not overwritten by random goal placement).

#### Scenario: Corners start revealed
- **WHEN** a run-mode board with corner extraction is created
- **THEN** the four corner cells are face up and have the extraction effect

### Requirement: Extract program action
A run program MAY include an `extract` action. While standing on an extraction tile, `extract` SHALL merge the run inventory into the stash, clear the run inventory, set status to `extracted`, and SHALL NOT apply the step’s move. Off an extraction tile, `extract` SHALL lose the run with a reported reason and SHALL NOT move.

#### Scenario: Extract while on extraction
- **WHEN** the hero is on an extraction tile and the step action is extract
- **THEN** carried items are banked to the stash, status is extracted, and the hero does not move for that step

#### Scenario: Extract off extraction fails
- **WHEN** the hero is not on an extraction tile and the step action is extract
- **THEN** the run is lost and the hero does not move

### Requirement: Random placements may set walls
A board `randomPlacements` entry MAY declare `walls` and MAY declare `count` (default 1). The engine SHALL place that many cells of the given type onto eligible cells (seeded via the board side-wall seed), applying walls when provided. Each placed cell SHALL no longer be eligible for later placements that target the previous type.

#### Scenario: Placement applies walls
- **WHEN** a random placement for a type includes walls on all four sides
- **THEN** the placed cell has those four side walls

#### Scenario: Count places multiple cells
- **WHEN** a random placement requests count 3 for a type on meadow cells
- **THEN** exactly three cells of that type are placed on formerly eligible meadow cells

### Requirement: Seeded coin stacks on cells
A board config MAY declare coin weight probabilities for 0–3 coins. After tiles and walls are built, the engine SHALL assign each cell a coin stack using those weights and the board seed. Goblin Woods uses 40% 0, 30% 1, 20% 2, 10% 3.

#### Scenario: Weights produce only 0–3
- **WHEN** a board with coin weights is created
- **THEN** every cell’s coin count is 0, 1, 2, or 3

### Requirement: Collect coins on safe landing
When the hero successfully moves onto a cell and the run stays playing or becomes won/extracted from that successful occupancy, the engine SHALL add that cell’s remaining coins to the persistent wallet and clear the cell’s coins. Path-over / lost landings SHALL NOT collect coins.

#### Scenario: Safe meadow collects coins
- **WHEN** the hero steps onto a meadow with 2 coins and the run stays playing
- **THEN** the wallet increases by 2 and that cell has 0 coins

#### Scenario: Path-over does not collect
- **WHEN** the hero path-overs onto a hazard cell that has coins
- **THEN** the wallet is unchanged and the cell still has its coins

### Requirement: Persistent coin wallet
Game state SHALL include a coin wallet. Soft reset SHALL preserve the wallet. Full reset / New map SHALL set the wallet to 0. Coins do not require extraction to keep.

#### Scenario: Soft reset keeps wallet
- **WHEN** the wallet has coins and a soft reset runs
- **THEN** the wallet still has those coins

### Requirement: Shop buys catalog items for coins
A tile type MAY declare effect kind `shop`. Shops are safe to step onto. A `buyFromShop` program action while standing on a shop SHALL spend 3 wallet coins and add the chosen catalog item to run inventory when the wallet has at least 3 coins; otherwise the run is lost. Shops SHALL remain available for repeated buys (not one-shot resolved). Buying does not require Mage resolution rules.

#### Scenario: Buy on shop succeeds
- **WHEN** the hero is on a shop with at least 3 coins and programs buyFromShop for a valid item
- **THEN** the wallet decreases by 3, the item is in run inventory, and the run stays playing

#### Scenario: Buy without enough coins fails
- **WHEN** the hero is on a shop with fewer than 3 coins and programs buyFromShop
- **THEN** the run is lost

#### Scenario: Buy off shop fails
- **WHEN** the hero is not on a shop and programs buyFromShop
- **THEN** the run is lost

### Requirement: Coin pickup reports to the player
When coins are collected from a cell into the wallet, the engine SHALL set a run bump message that includes the amount collected and the new wallet total.

#### Scenario: Collect reports total
- **WHEN** the hero safely lands on a cell with 2 coins and the wallet was 1
- **THEN** the bump mentions collecting 2 coins and a wallet total of 3

