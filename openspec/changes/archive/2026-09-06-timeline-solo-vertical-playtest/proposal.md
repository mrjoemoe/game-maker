## Why

The Timeline Game playtest is hard to read: hand cards look identical, time runs sideways, and there is no 1–20 depth ruler. The designer wants a 1-player mode as the ongoing playtest target.

## What Changes

- Color-code hand cards by type (person, place, thing, society, and so on).
- Hover a timeline card to see culture, science, and politics at that moment.
- Compact cards (half height) and grow time **up** from epoch, with rows numbered 1–20.
- Declare **1 player** as the active playtest mode (`playerCount: 1`).

## Impact

- **modified:** `playtest-web-app` (canvas, hand, hover)
- **modified:** `timeline-game-variant` / `core/timeline` (solo player count)
- **reused:** timeline engine graph and devices
