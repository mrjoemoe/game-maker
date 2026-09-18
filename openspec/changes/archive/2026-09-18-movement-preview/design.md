## Decisions

- Preview is CSS classes on tiles, not a second SVG path, so it stays aligned with the grid.
- Hover preview starts from the projected end of the current chart (same as click-to-queue).
- The executing slot’s destination cell gets an extra highlight; the token uses a short CSS pulse rather than interpolating between grid cells.
