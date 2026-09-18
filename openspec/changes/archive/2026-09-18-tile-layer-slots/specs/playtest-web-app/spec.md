## MODIFIED Requirements

### Requirement: Coins and shop buy in the planner
The path planner SHALL offer Buy-from-shop actions for each catalog item (cost 3). Projected wallet across queued buys SHALL disable further Buy actions when fewer than 3 coins would remain. The playtest app SHALL show a prominent persistent coin wallet in an inventory section placed underneath the board, alongside the stash. Face-up tiles with remaining coins SHALL show a coin badge in a dedicated tile slot that is not obscured by the hero piece, the effect icon, or the terrain label.

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

#### Scenario: Tile chrome does not overlap
- **WHEN** a face-up cell has an effect icon, remaining coins, a terrain label, and a piece
- **THEN** those four layers occupy distinct slots so none covers another
