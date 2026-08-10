## Decisions

1. `TileState.coins` remaining on cell; `GameState.coins` wallet.
2. Collect only when the step keeps the run playing (or wins) after moving onto the cell; path-over collects nothing.
3. Shop is safe terrain like Mage; `buyFromShop` costs 3, does not resolve the shop, items go to run inventory.
4. `BoardConfig.coinWeights` optional; Goblin Woods enables default 40/30/20/10.
5. Soft reset keeps wallet; full reset clears it.

## Open Questions

None.
