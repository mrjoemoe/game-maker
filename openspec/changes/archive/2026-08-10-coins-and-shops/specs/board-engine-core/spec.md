## ADDED Requirements

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
