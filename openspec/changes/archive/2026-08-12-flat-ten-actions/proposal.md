## Why

Action+move pairs are confusing and under-count moves. Players should chart a flat list of actions where each orthogonal step, grab, use, buy, travel, or extract costs one action slot. Coins stay free (passive on landing).

## What Changes

- Replace paired `ProgramStep { action, move }` with atomic actions; add `move` (up/down/left/right) as actions
- Cap programs at **10** actions (Goblin Woods / programmed-run default)
- Use-item arms the next move action; collecting coins is not an action
- UI: action bank on the right (includes direction actions); horizontal action track below the board, above inventory

## Impact

- Capabilities: `board-engine-core`, `playtest-web-app`, `goblin-woods-variant`, `game-component-library`
- Components: **modified** `rules/programmed-run` (default `programLength: 10`, docs); **reused** board/items
- RULEBOOK: turn structure
