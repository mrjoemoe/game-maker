## Decisions

- Ignore shortcuts when the event target is an input/textarea/select or when a modifier other than Shift is held.
- Enter runs the chart only if Run would be enabled (at least one step, not executing).
- Seed is `definition.board.edgeWalls.seed` when present; copy writes that number as text.
