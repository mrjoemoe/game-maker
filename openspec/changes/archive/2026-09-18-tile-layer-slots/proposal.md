## Why

Tile icons, coin badges, labels, and pieces share overlapping absolute positions on a small cell. Playtest tiles should read at a glance without chrome covering other chrome.

## What Changes

- Give each tile dedicated layout slots: effect icon, coins, terrain label, and piece
- Stop using competing absolute positions for those layers
- Keep coin badges unobscured by the piece, matching the existing coin visibility rule

## Impact

- Capability: `playtest-web-app`
- Engine: reused
- Components: none
