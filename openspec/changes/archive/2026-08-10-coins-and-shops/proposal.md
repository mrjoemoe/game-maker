## Why

Players need a persistent currency loop and a way to buy gear without relying only on the Mage. Coins on tiles plus shop purchases add that economy.

## What Changes

- After board generation, seed coin stacks on cells (40%/30%/20%/10% → 0/1/2/3).
- Landing safely on a cell collects its coins into a persistent wallet (kept without extract; survive soft reset; cleared on New map).
- Add shop tile effect; Goblin Woods places 3 shops on meadow cells.
- Program action `buyFromShop` purchases any catalog item for 3 coins into run inventory (repeatable).
- Playtest HUD/tiles/planner show coins and Buy actions.

## Impact

- engine board/tiles/run/game, Goblin Woods config + rulebook, web HUD/planner/tiles
