## Decisions

- Debug tools are UI-only flags. Reveal-all stays a display override.
- Walk-now and teleport are mutually exclusive with chart-queue: while either is on, a board click does not append to the action track.
- Teleport is for layout inspection and does not reveal tiles or trigger effects.
- The inspector shows the last clicked cell even when the click also moved the hero.
