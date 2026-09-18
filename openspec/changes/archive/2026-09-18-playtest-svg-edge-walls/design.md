## Decisions

- Board-level SVG overlay with `viewBox="0 0 width height"` and `vector-effect: non-scaling-stroke` so strokes stay even when the grid stretches.
- Parse stored `h:x,y` / `v:x,y` keys into segments in the engine so the UI does not re-implement wall geometry.
- Remove CSS gap; walls sit on integer cell boundaries. Tile chrome is inset so labels do not sit under the stroke.
- Tile `aria-label` still names walled sides; the SVG is `aria-hidden`.
