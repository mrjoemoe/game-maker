## Decisions

- Wrap existing `ActionBank` and `ActionTrack` in `ActionsPanel` rather than merging their logic.
- Place the panel above `BoardView` in the run-mode column. Track (queue + Run) sits above the choice buttons so the current chart is the first thing you see.
- Drop `.stage-run`’s two-column sidebar layout.
