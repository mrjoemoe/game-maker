## ADDED Requirements

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
A tile type MAY declare effect kind `extraction`. Stepping onto an extraction tile while the run is playing SHALL move the hero onto it, reveal it if needed, merge the current run inventory into the stash, clear the run inventory, and set run status to `extracted` (not won). Extraction SHALL NOT require a pass item. Extraction is not the win condition.

#### Scenario: Extract with gathered gear
- **WHEN** the hero steps onto an extraction tile while holding items in the run inventory
- **THEN** those items are in the stash, the run inventory is empty, and the run status is extracted

#### Scenario: Extract empty-handed
- **WHEN** the hero steps onto an extraction tile with an empty run inventory
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

## MODIFIED Requirements

### Requirement: Tile effects
A tile type MAY declare an effect that resolves when a hero steps onto a cell of that type. Supported effects SHALL include: none/empty, wall (impassable), trap (damage), enemy (combat), powerup (grants an item), mage (choose one item), goal (win), and extraction (bank inventory and end the attempt as extracted).

#### Scenario: Tile type declares an effect
- **WHEN** a tile type is defined with an enemy effect of power P and damage D
- **THEN** the engine can resolve that tile type to its effect kind and parameters

#### Scenario: Tile without an effect is inert
- **WHEN** a hero steps onto a tile type with no effect
- **THEN** no damage, item, or status change occurs

### Requirement: Run state
When run mode is enabled, the game state SHALL include a run with status (playing, won, lost, or extracted), current and max HP, an inventory of item ids, and an attempt count, plus a persistent stash of item ids on the game state.

#### Scenario: Initial run state
- **WHEN** a run-mode game is created with max HP M
- **THEN** the run starts playing with HP M, an empty inventory, empty stash, and attempt count 1

### Requirement: Soft reset preserves learned map and items
The engine SHALL provide a soft reset action that returns the hero to the start position, restores HP to max, clears the run inventory without changing the stash, increments the attempt count, and clears enemy resolved flags, while preserving revealed tile faces, Mage resolved state, and stash contents. A full reset action SHALL clear the stash, rebuild the board, and return run state to the initial definition; when run mode is enabled and the board uses generated side walls, full reset SHALL re-roll the side-wall seed so the new map’s wall layout can differ.

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

### Requirement: Safe path tiles only
In run mode, stepping onto a tile whose effect is not empty, mage, or extraction SHALL end the run as lost and report why (e.g. found a Castle — path over), unless that step’s action used the tile’s `passItemId`. Full-cell wall tiles without a matching used pass item SHALL reveal, keep the hero in place, and end the run as lost. Mage and extraction tiles are safe to step onto (extraction then banks and ends the attempt).

#### Scenario: Castle ends the path
- **WHEN** the hero steps onto a goal/castle tile without using its pass item that step
- **THEN** the run status becomes lost and the bump message states the castle ended the path

#### Scenario: Extraction does not path-over
- **WHEN** the hero steps onto an extraction tile
- **THEN** the run does not become lost from that tile’s effect alone; extraction banking applies

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
Mage tiles SHALL NOT open an interactive pending choice on step. Granting SHALL occur only via a `takeFromMage` program action while standing on an unresolved Mage. Stepping onto a Mage tile SHALL be a safe move. Granted items SHALL enter the run inventory only; they SHALL NOT enter the stash until the hero extracts or wins. Soft reset SHALL preserve Mage resolved state and SHALL NOT place unextracted Mage grants into the next attempt’s inventory.

#### Scenario: First visit to Mage opens a choice
- **WHEN** the hero stands on an unresolved Mage and programs takeFromMage
- **THEN** choosing an item via that action grants it (no modal pending choice)

#### Scenario: Choosing an item grants to run inventory only
- **WHEN** takeFromMage succeeds for an item id
- **THEN** that item is in the run inventory, not in the stash, and the Mage cell is resolved

#### Scenario: Soft reset without extract loses Mage grant
- **WHEN** a soft reset runs after an item was granted by the Mage but the run did not extract or win
- **THEN** that item is not in the stash and the new attempt’s inventory does not include it unless loaded again from stash; the Mage remains resolved

#### Scenario: Stepping onto Mage does not pause for a picker
- **WHEN** the hero moves onto an unresolved Mage without a takeFromMage action on that step
- **THEN** the hero arrives on the Mage, the run stays playing, and no pending item choice is set

### Requirement: Action-then-move program steps
A run program SHALL consist of 1 to `programLength` steps, each pairing a program action with an orthogonal move. Each step SHALL apply the action first, then the move. If the action is invalid for the current situation, the run SHALL be lost with a reported reason and the move SHALL not apply. Successful `useItem` actions SHALL consume the item from the run inventory.

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

### Requirement: Sledgehammer breaks side walls
An item MAY declare `breaksSideWalls`. Using that item as a step action SHALL clear side walls on the edge being crossed when that crossing is blocked and SHALL consume the item from the run inventory; using it when the crossing is not blocked SHALL fail the run.

#### Scenario: Sledgehammer clears a blocked crossing
- **WHEN** the hero uses a breaksSideWalls item and the upcoming move is blocked by a side wall
- **THEN** those walls are cleared, the move proceeds, and the item is removed from the run inventory
