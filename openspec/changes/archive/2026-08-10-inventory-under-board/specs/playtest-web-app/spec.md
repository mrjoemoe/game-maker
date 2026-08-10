## MODIFIED Requirements

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

### Requirement: Stash and loadout UI
When run mode is enabled, the playtest app SHALL show the persistent stash in the under-board inventory section, separately from the current run (on-person) inventory. Before starting a program on a fresh attempt (empty run inventory after new map or soft reset), the UI SHALL let the player choose any subset of stash items as the loadout and commit that loadout into the run inventory. Committing an empty loadout SHALL be allowed (start with no items).

#### Scenario: Empty stash on new map
- **WHEN** a new Goblin Woods map starts
- **THEN** the stash panel shows no stored gear and the run inventory is empty

#### Scenario: Player commits a loadout
- **WHEN** the stash holds a knife and the player selects it and commits the loadout
- **THEN** the knife appears in the run inventory and no longer in the stash
