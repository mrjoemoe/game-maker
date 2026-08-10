## Why

Collecting coins wiped them from tiles, so after Try again the map looked empty even though the wallet was meant to accumulate across runs.

## What Changes

- Landing still credits the wallet, but does not remove coins from the tile
- Each cell credits at most once per attempt; soft reset clears that claim so coins can be gathered again next run
- Wallet still persists across soft reset; New map still resets the wallet
- Update rulebook + specs

## Impact

- Engine: collect logic + GameState claim list
- Specs: board-engine-core
- Prototype: RULEBOOK
