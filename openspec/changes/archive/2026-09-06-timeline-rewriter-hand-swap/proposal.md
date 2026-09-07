## Why

Rewriter currently pulls a replacement from the debug catalog and dumps the old card in a deck. It should just swap a hand card with a timeline card.

## What Changes

- Rewriter exchanges one played timeline card with one card from the player’s hand.
- The displaced timeline card goes to hand; nothing is returned to a deck.
- Play tab: click the timeline card, then a hand card. Debug catalog is no longer a rewrite picker.

## Impact

- **modified:** timeline engine Rewriter; `core/timeline` copy
- **modified:** `board-engine-core`, `playtest-web-app`, `timeline-game-variant`
