## Why

Person / place / thing should be a facedown Omega pile, not mixed into the hand. Action cards (society, invention, resource, random-draw) are the only draw-to-hand deck. Blueprints are their own pile, reached by playing Draw Blueprint.

## What Changes

- 30 Omega event cards (person / place / thing) with yellow backs in their own pile.
- Action pile (green backs): society, invention, resource, Random Event, Draw Blueprint.
- Playing Random Event places the top Omega card on the timeline.
- Playing Draw Blueprint puts the top blueprint into the hand.
- Show the three facedown piles in the playtest UI.

## Impact

- **modified:** `core/timeline` (catalog, 30 omega events, draw cards)
- **modified:** timeline engine (three piles)
- **modified:** `playtest-web-app` (pile chrome)
- **modified:** `timeline-game-variant` (rulebook)
- **modified:** `board-engine-core` (decks)
