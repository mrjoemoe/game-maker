## MODIFIED Requirements

### Requirement: Coins and shop buy in the planner
The path planner SHALL offer Buy-from-shop actions for each catalog item (cost 3). Projected wallet across queued buys SHALL disable further Buy actions when fewer than 3 coins would remain. The HUD SHALL show a prominent persistent coin wallet counter that updates whenever coins are collected or spent. Face-up tiles with remaining coins SHALL show a coin badge that is not obscured by the hero piece.

#### Scenario: Buy action listed
- **WHEN** the player composes a path step
- **THEN** Buy actions for catalog items are available alongside Take/Use/Extract

#### Scenario: HUD shows coins
- **WHEN** the wallet has N coins
- **THEN** the run HUD displays that coin count in a dedicated wallet control

#### Scenario: Face-up tile shows remaining coins
- **WHEN** a face-up cell still has coins and is not covered by UI that hides the badge
- **THEN** the tile shows the remaining coin count
