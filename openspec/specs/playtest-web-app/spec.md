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
When run mode is enabled, the playtest app SHALL provide an action bank on the right of the board and a horizontal action track below the board (above inventory). The bank SHALL list left, up, down, and right in the same compact action list as take, buy, use, travel, and extract, without instructional lede copy and without a separate move pad. Clicking a bank action SHALL append it to the track left-to-right up to `programLength` (10 for Goblin Woods). The track SHALL highlight the executing action while running. Use-item actions SHALL be enabled for items held or taken/bought earlier in the queued program. Run SHALL be enabled with at least one queued action. A queued Extract SHALL prevent appending further actions. Collecting coins SHALL NOT appear as a bank action. The tile tally SHALL NOT sit in the action-bank column; it SHALL appear below inventory so the bank has vertical room for more choices.

#### Scenario: Direction appends to track
- **WHEN** the player clicks Right in the action bank
- **THEN** a move-right action appears as the next slot on the track below the board

#### Scenario: Run path executes queued moves
- **WHEN** the player fills the action track and activates Run
- **THEN** the app applies those atomic actions in order until the program finishes or the run ends

#### Scenario: Full program required before run
- **WHEN** fewer than `programLength` actions are queued but at least one is present
- **THEN** Run is enabled so the player can end the chart early

#### Scenario: Slot shows use-item then north
- **WHEN** the player appends Use sword then Up to the track
- **THEN** those slots show the use-sword action and the up move as consecutive actions

#### Scenario: Run path executes queued actions
- **WHEN** the player queues actions and activates Run
- **THEN** the app applies those atomic actions in order until the program finishes or the run ends

#### Scenario: Short program can run
- **WHEN** fewer than `programLength` actions are queued but at least one is present
- **THEN** Run is enabled

#### Scenario: Take then use in the same plan
- **WHEN** the player queues takeFromMage for an item earlier in the track
- **THEN** Use for that item is available later in the same program

#### Scenario: Empty program cannot run
- **WHEN** no actions are queued
- **THEN** Run stays disabled

#### Scenario: Extract locks further slots
- **WHEN** the player queues Extract
- **THEN** additional actions cannot be appended until Undo or Clear

#### Scenario: Moves share the action list
- **WHEN** the action bank is shown
- **THEN** directional moves appear among the other action buttons without a separate move pad or lede paragraph

#### Scenario: Tile tally is below inventory
- **WHEN** run mode is shown
- **THEN** the tile tally is not stacked under the action bank on the right

### Requirement: Tile count tally
When run mode is enabled, the playtest app SHALL show a panel listing each tile type on the map with a count, placed below inventory rather than in the action-bank column. When a tile type declares a `passItemId`, the tally row SHALL show that item (label and/or icon) as the gear used to pass it.

#### Scenario: Tally lists meadow count
- **WHEN** the goblin-woods board is loaded
- **THEN** the tile tally shows how many meadow tiles exist on the board

#### Scenario: Tally shows pass item for pit
- **WHEN** the goblin-woods board is loaded
- **THEN** the pit tally row indicates Makeshift Bridge (or its icon) as the pass item

### Requirement: Playtest UI renders edge walls
The playtest board SHALL visually indicate every edge wall on the shared boundary between cells. Walls SHALL remain visible regardless of whether adjacent tiles are face-up or face-down. Each shared walled edge SHALL appear as a single segment between the two cells. Edge-wall segments SHALL use a high-contrast warm wood color so they are easy to see against the board. When a run ends because the path is over, the UI SHALL display the engine’s path-over reason.

#### Scenario: Walls visible on a fresh map
- **WHEN** a Goblin Woods map loads with face-down tiles
- **THEN** all edge walls on the board are visible in the gaps between cells

#### Scenario: Shared edge shows a wall segment
- **WHEN** two adjacent cells share a walled edge
- **THEN** the UI shows a single wall segment on that boundary

#### Scenario: Edge walls read brightly
- **WHEN** the playtest board is displayed
- **THEN** edge-wall bars use a bright warm wood palette that contrasts with face-down and face-up tiles

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

### Requirement: Debug reveal-all tiles
When run mode is enabled, the playtest app SHALL provide a Debug section with a control that reveals all tiles on the board for inspection. Turning the control off SHALL hide only tiles that are still face-down in game state (not yet revealed by play). Tiles already face-up from traversal or peeking SHALL remain visible.

#### Scenario: Debug shows every tile
- **WHEN** the player enables debug reveal-all
- **THEN** every cell on the board displays its face-up content

#### Scenario: Debug off hides only unrevealed tiles
- **WHEN** some tiles were revealed by play and others were only visible via debug reveal-all
- **AND** the player disables debug reveal-all
- **THEN** play-revealed tiles stay face-up and never-revealed tiles are face-down again

### Requirement: Timeline playtest canvas
When the active prototype enables timeline mode, the Play tab SHALL render a branching timeline with **epoch at the bottom** and later nodes stacked **upward** on separate branch columns, plus a **1–20 row ruler** for path depth. The traveler token SHALL appear on the current node. Timeline nodes SHALL be compact (about half the previous card height). Hovering a timeline node SHALL show the cumulative culture, science, and politics on the path from epoch to that node. Wires SHALL distinguish **same-branch stems** from **fork** and **merge** connectors: forks and merges SHALL route through gutters and row gaps so they do not overlap cards or branch mats. When no local path can miss those tiles, the connector SHALL split: each end SHALL show the **same letter** so the join is still readable. A **preserved prefix** SHALL have a yellow wash behind the locked cards and the branch mat, not behind cards laid after the lock. The **primary** branch SHALL sit in the horizontal center of the timestream so later branches can open to its left and its right.

#### Scenario: Seeded timeline is visible
- **WHEN** Timeline Game loads on the Play tab
- **THEN** the epoch node sits at the bottom with a primary branch mat, at least one event node stacked above it, and row numbers 1–20 along the time axis

#### Scenario: Hover shows society at that moment
- **WHEN** the player hovers a timeline card
- **THEN** the UI shows culture, science, and politics totaled along the path to that card

#### Scenario: Fork wire is distinct from a stem
- **WHEN** a branch is created from a timeline node
- **THEN** the connector to the new column is a side-routed fork wire, visually distinct from the vertical stem on the parent timeline

#### Scenario: Blocked fork uses letter jump
- **WHEN** a fork cannot be routed through nearby gutters without overlapping a card or mat
- **THEN** each end of the connector is labeled with the same letter and the stroke does not cross the blocking tile

#### Scenario: Preserved branch is yellow
- **WHEN** a branch is preserved through a mid-path card and later cards exist beyond that lock
- **THEN** the yellow wash covers the locked cards and mat and does not cover the later unlocked cards

#### Scenario: Primary branch starts centered
- **WHEN** Timeline Game loads on the Play tab
- **THEN** the primary branch sits in the horizontal center of the timestream with open space to both sides

#### Scenario: Forks open left and right
- **WHEN** two branches are created from the primary timeline
- **THEN** one new column is to the left of the primary branch and the other is to the right

### Requirement: Preserver prefix wash
The Play tab SHALL paint a yellow wash behind the preserved prefix of a branch (locked cards and the branch mat), not behind cards laid after the lock.

#### Scenario: Wash stops at the lock
- **WHEN** a branch is preserved through a mid-path card and later cards exist beyond that lock
- **THEN** the yellow wash covers the locked cards and mat and does not cover the later unlocked cards

### Requirement: Head-to-head merge wire
The Play tab SHALL draw a merge connector from the ended branch’s last card to the destination branch’s head. That connector SHALL NOT splice into the destination stem as if the destination card had an extra parent.

#### Scenario: Merge line is end to end
- **WHEN** one branch has merged into another
- **THEN** a merge wire runs from the ended head to the continuing head and the destination stem stays a single parent-child line

### Requirement: Play and Rulebook tabs for Timeline Game
Timeline Game SHALL offer Play and Rulebook tabs at `/play` and `/rulebook`. Rulebook SHALL show the variant `RULEBOOK.md`.

#### Scenario: Open Timeline Game rulebook
- **WHEN** the player selects the Rulebook tab or opens `/rulebook`
- **THEN** the Timeline Game rules markdown is shown instead of the timeline canvas

### Requirement: Play and Rulebook routes
When the active prototype has a rulebook, the playtest app SHALL show Play at `/play` and Rulebook at `/rulebook`. Visiting `/` SHALL show Play at `/play`. Changing tabs SHALL update the path without resetting the playtest session.

#### Scenario: Rulebook URL
- **WHEN** the player opens `/rulebook` on a prototype that has a rulebook
- **THEN** the Rulebook view is shown and the address is `/rulebook`

#### Scenario: Play URL
- **WHEN** the player opens `/play` or `/`
- **THEN** the Play view is shown and the address is `/play`

#### Scenario: Tab switch keeps the session
- **WHEN** the player switches between Play and Rulebook
- **THEN** the path changes to `/play` or `/rulebook` and the playtest game state is not reset

### Requirement: Player mat and debug device dock
The Play tab SHALL show a player mat (parts, minerals, crystals, up to 3 device slots, blueprints, objectives). In debug mode it SHALL provide always-available Device A–H controls with targeting instructions, plus a debug draw from the **green action pile** and the ability to add any catalog card to hand. It SHALL NOT offer a Draw random control. Hand cards SHALL use the same type coloring as timeline cards (not an unmarked white face). While a device is armed, the Play tab SHALL show a **top banner** naming that device and the next click required to use it; the matching dock control SHALL appear armed until the player completes the action or cancels. Timeline nodes SHALL NOT be labeled or drawn as Open rift tiles. Merger targeting copy SHALL tell the player which branch ends and which branch it continues into.

#### Scenario: Branch from the dock
- **WHEN** the player activates Brancher, a timeline node, and an action card in hand
- **THEN** a new branch lane and branch mat appear from that node with the chosen card as the first card on the branch

#### Scenario: Armed device banner
- **WHEN** the player clicks Brancher in the device dock
- **THEN** a top banner names Brancher and tells the player to click the timestream moment to fork from
- **AND** the Brancher dock control appears armed

#### Scenario: Brancher asks for a card
- **WHEN** Brancher has a fork node selected
- **THEN** the banner tells the player to click an action card in hand to lay on the new branch

#### Scenario: Debug draw into hand
- **WHEN** the player activates the green action pile
- **THEN** a card appears in the hand panel with a visible type color and label

#### Scenario: Merger names the ending branch
- **WHEN** Merger is armed
- **THEN** the banner says to click the timeline that ends, then the timeline that continues (the join is head to head)

#### Scenario: No draw-random control
- **WHEN** Timeline Game is shown on the Play tab
- **THEN** the hand panel shows the three facedown piles and does not offer a Draw random control

### Requirement: Wide player mat and devices under hand
The Play tab SHALL give the player mat about **two thirds** of the lower row and the hand column about **one third**. Device A–H controls SHALL sit under the hand, not beside the mat. The three device slots SHALL be card-sized and SHALL show remaining uses as tokens. Blueprint cards SHALL show their use tokens.

#### Scenario: Mat is the wide column
- **WHEN** Timeline Game is shown on the Play tab at a desktop width
- **THEN** the player mat is the wider lower column and the hand column is narrower

#### Scenario: Devices sit under the hand
- **WHEN** Timeline Game is shown on the Play tab
- **THEN** Device A–H controls are in the hand column below the hand and piles

#### Scenario: Slots show use tokens
- **WHEN** a device occupies a player-mat slot
- **THEN** that slot is card-sized and shows remaining uses as tokens

### Requirement: Facedown card piles
The Play tab SHALL show three facedown piles: Omega events with **yellow** backs, action cards with **green** backs, and blueprints. The Omega pile SHALL represent the remaining person/place/thing cards. Clicking the action pile SHALL draw into the hand.

#### Scenario: Omega pile is yellow
- **WHEN** Timeline Game is shown on the Play tab
- **THEN** a facedown Omega pile with a yellow back is visible with a remaining-card count

#### Scenario: Action pile draws
- **WHEN** the player activates the green action pile
- **THEN** the top action card is added to the hand

### Requirement: Rewriter targeting uses the hand
While Rewriter is armed, the Play tab SHALL instruct the player to click a timeline card, then a card in hand. Completing those two clicks SHALL swap those cards. The debug catalog SHALL NOT apply Rewriter.

#### Scenario: Banner asks for a hand card
- **WHEN** Rewriter has a timeline card selected
- **THEN** the banner tells the player to click a card in hand to swap onto that moment

### Requirement: Click-to-move in debug
In timeline debug mode, activating a node SHALL move the traveler there so the designer can walk through time without turn-rule checks.

#### Scenario: Click a future node
- **WHEN** debug is on and the player activates a node ahead of the traveler
- **THEN** the traveler token is shown on that node
