## ADDED Requirements

### Requirement: Coin pickup reports to the player
When coins are collected from a cell into the wallet, the engine SHALL set a run bump message that includes the amount collected and the new wallet total.

#### Scenario: Collect reports total
- **WHEN** the hero safely lands on a cell with 2 coins and the wallet was 1
- **THEN** the bump mentions collecting 2 coins and a wallet total of 3
