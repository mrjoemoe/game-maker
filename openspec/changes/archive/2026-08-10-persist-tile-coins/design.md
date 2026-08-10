## Decisions

- Keep coin stacks on cells forever for a given map (New map re-rolls).
- `claimedCoinKeys` prevents double-credit within one attempt; soft reset clears claims so the same stacks can be gathered again while the wallet keeps growing.
