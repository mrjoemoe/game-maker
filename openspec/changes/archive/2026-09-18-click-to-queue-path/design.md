## Decisions

- Click queues moves; it does not execute them. Run still applies the chart. That keeps programmed-run rules intact.
- Pathfinding is BFS on orthogonal neighbors. Edge walls always block. Face-up `wall` tiles block. Face-down hazards do not, because the player has not revealed them.
- Projection walks only `move` steps already on the track so a second click continues from the planned end, not the live piece.
- If the walk is longer than remaining slots, append as many steps as fit.
- Clicking the projected cell, a blocked destination, or an unreachable cell is a no-op.
