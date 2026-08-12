## Decisions

- `ProgramStep` becomes an alias of `ProgramAction`; remove `none` and the paired move field.
- Directions are `{ kind: "move", direction }`.
- `useItem` sets `run.pendingUseItemId`; the next `move` applies wall/pass prep then steps. Any other action while pending (or ending the program still pending) paths over.
- Coin collection remains a landing side effect, not chartable.
- Layout: right sidebar = action bank + tally; board column = board → action track → inventory.
