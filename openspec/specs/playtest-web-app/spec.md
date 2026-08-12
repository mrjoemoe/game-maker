# playtest-web-app Specification

## Purpose

Provides a browser playtest UI that loads a selected prototype, renders its board, and lets a designer flip tiles (when enabled), move pieces, and reset state while prototyping.
## Requirements
### Requirement: Render configured board
The playtest web app SHALL render the board grid and show each cell's face-up tile content or a face-down back when the tile is hidden.

#### Scenario: Face-up tile shows type
- **WHEN** a tile is face-up
- **THEN** the UI shows that tile's type visual (at least label or color)

#### Scenario: Face-down tile hides type
- **WHEN** a tile is face-down
- **THEN** the UI shows a generic back and does not reveal the tile type label

### Requirement: Interactive tile flip
The playtest web app SHALL allow the user to flip a tile by interacting with its cell when flipping is enabled for the active prototype.

#### Scenario: Click flips tile
- **WHEN** the user activates a cell for flip and flip is enabled
- **THEN** that cell's tile face state toggles and the UI updates

### Requirement: Interactive piece move
The playtest web app SHALL allow selecting a piece and then selecting a destination cell to move it, updating the rendered board.

#### Scenario: Select then move
- **WHEN** the user selects a piece and then activates an in-bounds destination cell
- **THEN** the piece appears at the destination and no longer at the previous cell

### Requirement: Reset control
The playtest web app SHALL provide a control that resets the session to the game definition's initial board and piece layout. In run mode that control is labeled New map and SHALL produce a freshly generated layout when the prototype uses seeded side walls / random placements (new seed → new walls and content placements).

#### Scenario: Reset restores initial layout
- **WHEN** the user activates reset after changing the board
- **THEN** the UI shows the initial tile face states and piece positions from the loaded game definition

#### Scenario: New map changes wall layout
- **WHEN** the user activates New map on a run-mode prototype with generated side walls
- **THEN** the session starts a new run whose side-wall seed differs from the previous map’s seed

### Requirement: Load prototype by launch selection
The playtest web app SHALL load the game definition from the prototype selected at launch (environment/config), not from a hard-coded single template package import.

#### Scenario: Launch meadow prototype
- **WHEN** the playtest app is started with prototype id `meadow-v1`
- **THEN** it renders the board and name from `prototypes/meadow-v1`

### Requirement: Honor flip feature flag in UI
When tile flipping is disabled for the active prototype, the playtest UI SHALL NOT offer flip mode (or SHALL no-op flip interactions).

#### Scenario: Flip UI hidden when disabled
- **WHEN** the active prototype disables tile flip
- **THEN** the Flip tiles control is not available as an active flip mode

### Requirement: Run-mode HUD and step interaction
When the active prototype enables run mode, the playtest app SHALL display current/max HP, the run inventory, the stash summary, the attempt count, and run status messaging.

#### Scenario: HUD reflects run state
- **WHEN** the run status or bump message changes
- **THEN** the HUD updates to show HP, run inventory, stash, and any path-over reason

### Requirement: Win/lose banner and retry
When a run ends as won or lost, the app SHALL show a win or lose banner (including the path-over reason when present) and offer a try-again control that soft resets the run while preserving the revealed map and stash. After a win, banked gear SHALL remain visible in the stash.

#### Scenario: Retry after losing
- **WHEN** a run is lost and the player selects try again
- **THEN** the hero returns to start with the map still revealed, a new attempt begins with empty run inventory, and items that were on the person for the failed run are not restored

### Requirement: Revealed tile effect icons
Revealed tiles SHALL display an indicator of their effect (enemy, trap, powerup, wall, goal, mage, extraction) so the player can learn the map, and resolved enemy/powerup tiles SHALL be shown as cleared. Corner extraction tiles SHALL show their extraction indicator while face up.

#### Scenario: Defeated enemy shown as cleared
- **WHEN** an enemy has been defeated on a cell
- **THEN** that cell is rendered as a cleared enemy tile

#### Scenario: Corner extraction visible
- **WHEN** the board loads with face-up corner extraction tiles
- **THEN** those corners show an extraction indicator

### Requirement: Path planner UI
When run mode is enabled, the playtest app SHALL provide a side path planner to queue up to `programLength` action+move pairs and execute them in order (action then move), stopping when the run ends. The UI SHALL let the player choose each step’s action (`none`, take from Mage, use an item, or extract) and move direction. Each slot SHALL display the action summary and move. When composing a later step, Use-item actions SHALL be enabled for items in the current inventory and for items taken via earlier queued `takeFromMage` steps in the same program, minus items used in earlier queued `useItem` steps. Run path SHALL be enabled when at least one complete pair is queued (not only when all slots are filled). A queued Extract step SHALL prevent appending further steps.

#### Scenario: Run path executes queued moves
- **WHEN** the player fills all program slots and activates run path
- **THEN** the app applies those action+move pairs in order until the program finishes or the run ends

#### Scenario: Full program required before run
- **WHEN** fewer than `programLength` complete action+move pairs are set but at least one pair is queued
- **THEN** Run path is enabled so the player can end the chart early

#### Scenario: Slot shows use-item then north
- **WHEN** the player sets a step to use the sword and move up
- **THEN** that slot shows both the use-sword action and the up move

#### Scenario: Take then use in the same plan
- **WHEN** the player queues takeFromMage for an item in an earlier slot
- **THEN** Use for that item is available when composing a later slot in the same program

#### Scenario: Empty program cannot run
- **WHEN** no action+move pairs are queued
- **THEN** Run path stays disabled

#### Scenario: Extract locks further slots
- **WHEN** the player queues Extract as a step action
- **THEN** additional steps cannot be appended until Undo or Clear

### Requirement: Tile count tally
When run mode is enabled, the playtest app SHALL show a side panel listing each tile type on the map with a count. When a tile type declares a `passItemId`, the tally row SHALL show that item (label and/or icon) as the gear used to pass it.

#### Scenario: Tally lists meadow count
- **WHEN** the goblin-woods board is loaded
- **THEN** the tile tally shows how many meadow tiles exist on the board

#### Scenario: Tally shows pass item for pit
- **WHEN** the goblin-woods board is loaded
- **THEN** the pit tally row indicates Makeshift Bridge (or its icon) as the pass item

### Requirement: Visible side walls and path-over report
Revealed tiles with side walls SHALL show visible wall indicators on those sides. When a run ends because the path is over, the UI SHALL display the engine’s path-over reason.

#### Scenario: Lose banner shows path-over reason
- **WHEN** the run is lost with a bump message
- **THEN** the lose banner shows that message

### Requirement: Side inventory panel
When run mode is enabled, the playtest app SHALL show a side panel for the hero’s current run inventory (or an empty state) and SHALL update when items are granted, consumed, or banked.

#### Scenario: Empty inventory on new map
- **WHEN** a new Goblin Woods map starts
- **THEN** the side run inventory shows that no gear is held yet

#### Scenario: Inventory updates after consume
- **WHEN** the hero uses a pass item successfully
- **THEN** that item no longer appears in the run inventory panel

### Requirement: Mage item picker
The playtest app SHALL NOT show an interactive Mage item-picker modal. Taking an item from the Mage SHALL be done by programming a takeFromMage action while on the Mage tile.

#### Scenario: Picker appears on Mage
- **WHEN** the hero steps onto an unresolved Mage during path execution
- **THEN** no item-picker dialog is shown

### Requirement: Play and Rulebook tabs
When the active prototype provides a rulebook, the playtest app SHALL offer Play and Rulebook tabs. Play shows the normal playtest session. Rulebook shows the prototype’s rulebook markdown in a readable panel.

#### Scenario: Switch to Rulebook
- **WHEN** the player selects the Rulebook tab on Goblin Woods
- **THEN** the rulebook content is shown instead of the board session UI

### Requirement: Stash and loadout UI
When run mode is enabled, the playtest app SHALL show the persistent stash in the under-board inventory section, separately from the current run (on-person) inventory. Before starting a program on a fresh attempt (empty run inventory after new map or soft reset), the UI SHALL let the player choose any subset of stash items as the loadout and commit that loadout into the run inventory. Committing an empty loadout SHALL be allowed (start with no items).

#### Scenario: Empty stash on new map
- **WHEN** a new Goblin Woods map starts
- **THEN** the stash panel shows no stored gear and the run inventory is empty

#### Scenario: Player commits a loadout
- **WHEN** the stash holds a knife and the player selects it and commits the loadout
- **THEN** the knife appears in the run inventory and no longer in the stash

### Requirement: Extracted outcome banner
When a run ends with status extracted, the app SHALL show an extracted banner (distinct from win/lose) stating that carried gear was banked, and SHALL offer a try-again control that soft resets while preserving the revealed map and stash.

#### Scenario: Retry after extract
- **WHEN** a run is extracted and the player selects try again
- **THEN** the hero returns to start with the map still revealed, banked items remain in the stash, and a new loadout can be chosen

### Requirement: Extract action ends the chart
When composing a path, the playtest app SHALL offer an Extract program action. After a step whose action is Extract is queued, the UI SHALL NOT allow selecting further steps (append stays disabled until Undo/Clear removes that terminal Extract).

#### Scenario: Extract is available as an action
- **WHEN** the player composes a path step
- **THEN** Extract is listed among step actions

#### Scenario: No steps after Extract
- **WHEN** the player queues a step with the Extract action
- **THEN** further action/move append controls stay disabled until that step is undone or the path is cleared

### Requirement: Coins and shop buy in the planner
The path planner SHALL offer Buy-from-shop actions for each catalog item (cost 3). Projected wallet across queued buys SHALL disable further Buy actions when fewer than 3 coins would remain. The playtest app SHALL show a prominent persistent coin wallet in an inventory section placed underneath the board, alongside the stash. Face-up tiles with remaining coins SHALL show a coin badge that is not obscured by the hero piece.

#### Scenario: Buy action listed
- **WHEN** the player composes a path step
- **THEN** Buy actions for catalog items are available alongside Take/Use/Extract

#### Scenario: HUD shows coins
- **WHEN** the wallet has N coins
- **THEN** the under-board inventory section displays that coin count in a dedicated wallet control

#### Scenario: Inventory under board shows coins and stash
- **WHEN** the wallet has N coins and the stash has gear
- **THEN** an inventory section under the board displays the coin count and the stash

#### Scenario: Face-up tile shows remaining coins
- **WHEN** a face-up cell still has coins and is not covered by UI that hides the badge
- **THEN** the tile shows the remaining coin count

### Requirement: Portal travel actions in the planner
The path planner SHALL offer Travel to Portal 1–4 actions. Queued travel steps SHALL display as travel (not an orthogonal leave direction) in the chart.

#### Scenario: Travel actions listed
- **WHEN** the player composes a path step
- **THEN** Travel to Portal 1, 2, 3, and 4 are available as actions

### Requirement: Vite resolves game-library
The playtest Vite config SHALL alias `@game-maker/game-library` to the package TypeScript entry so composed prototype configs and the registry resolve during development and Docker launches.

#### Scenario: Goblin Woods loads in Vite
- **WHEN** the playtest app imports a prototype that depends on `@game-maker/game-library`
- **THEN** Vite resolves the import without a missing-module error
