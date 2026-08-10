## Why

Players need a way to obtain gear before facing rough terrain, and a clear inventory so they know what they can pass. Items should carry across retries on the same map.

## What Changes

- Inventory starts empty each new map; discovered items persist across soft-reset attempts.
- Add a Mage tile effect: stepping onto an unresolved Mage pauses for a one-item choice from the game’s item list, then grants it (and records it as discovered).
- Goblin Woods places a Mage as the first tile north of start.
- Playtest UI shows a side inventory panel and a Mage item picker when a choice is pending.

## Impact

- `board-engine-core`: mage effect, chooseItem action, pending choice on run state
- `playtest-web-app`: inventory panel + Mage picker; path execution pauses on choice
- `template-prototype-model`: Goblin Woods Mage placement
