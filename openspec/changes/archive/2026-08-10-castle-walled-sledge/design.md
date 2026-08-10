## Decisions

1. Castle cell gets `walls: [n,e,s,w]` via `randomPlacements[].walls`.
2. Castle `passItemId` becomes `sledgehammer` (tally + entry).
3. Defer sledgehammer consume until after the move succeeds so goal win + armedPass still see the item.

## Open Questions

None.
