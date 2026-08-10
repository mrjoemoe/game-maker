## Why

Players cannot tell coins exist: tile coin glyphs sit under the hero piece, newly revealed cells clear coins on the same step as reveal, and the wallet is a quiet meta label.

## What Changes

- Prominent persistent coin wallet in the run HUD that updates as coins are collected across attempts
- Clearer face-up tile coin badges that do not sit under the hero piece
- Status bump when coins are picked up (amount + new total)

## Impact

- Engine: coin-collect bump message
- Web: RunHud, TileView, CSS
- Specs: playtest-web-app, board-engine-core
