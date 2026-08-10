## ADDED Requirements

### Requirement: Coins and shop buy in the planner
The path planner SHALL offer Buy-from-shop actions for each catalog item (cost 3). Projected wallet across queued buys SHALL disable further Buy actions when fewer than 3 coins would remain. The HUD SHALL show the coin wallet. Face-up tiles with remaining coins SHALL show a coin indicator.

#### Scenario: Buy action listed
- **WHEN** the player composes a path step
- **THEN** Buy actions for catalog items are available alongside Take/Use/Extract

#### Scenario: HUD shows coins
- **WHEN** the wallet has N coins
- **THEN** the run HUD displays that coin count
