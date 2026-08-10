## MODIFIED Requirements

### Requirement: Collect coins on safe landing
When the hero successfully moves onto a cell and the run stays playing or becomes won/extracted from that successful occupancy, the engine SHALL add that cell’s coin stack to the persistent wallet if that cell has not already credited the wallet this attempt. The cell’s coin stack SHALL remain on the tile (not cleared). Path-over / lost landings SHALL NOT collect coins. Soft reset SHALL clear per-attempt coin claims so stacks can be gathered again on the next attempt while the wallet persists.

#### Scenario: Safe meadow collects coins
- **WHEN** the hero steps onto a meadow with 2 coins and the run stays playing
- **THEN** the wallet increases by 2 and that cell still has 2 coins

#### Scenario: Path-over does not collect
- **WHEN** the hero path-overs onto a hazard cell that has coins
- **THEN** the wallet is unchanged and the cell still has its coins

#### Scenario: Soft reset keeps tile coins and wallet
- **WHEN** the hero collected coins then soft resets
- **THEN** the wallet still has those coins and face-up cells still show their original stacks
