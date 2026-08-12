## Decisions

- **Edge identity:** undirected edges keyed `h:x,y` (between `(x,y)`–`(x+1,y)`) and `v:x,y` (between `(x,y)`–`(x,y+1)`).
- **Config:** `board.edgeWalls: { count: 15, seed?: number }` replaces weight-based `sideWalls`.
- **Connectivity:** after each candidate wall, BFS from a corner; all `width*height` cells must remain reachable.
- **Castle:** no longer force four cell-face walls; Sledgehammer remains the pass item. Spec/rulebook updated accordingly.
- **Pass items:** matching pass item still clears the single blocking edge for that step (same as sledgehammer for that crossing).

## Component disposition

| Part | Disposition |
|------|-------------|
| `boards/goblin-woods` | modified |
| `items/sledgehammer` | modified (docs) |
| Goblin Woods rulebook | variant-local |
