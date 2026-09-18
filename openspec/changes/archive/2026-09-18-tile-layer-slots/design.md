## Decisions

- CSS grid on `.tile` with named areas: `icon` (NW), `coins` (NE), `piece` (center), `label` (SW).
- Coins stay top-right so a centered hero does not cover them.
- Keep overflow clipped to the cell so badges cannot spill into neighboring tiles or wall strokes.
