## Decisions

- Render each undirected edge once via the west/north cell’s east/south rim so shared edges are not doubled.
- Position wall bars into the board grid gap so they read as between tiles, not inset decorations.
- Visibility is independent of tile face-up state; hidden tiles stay hidden, walls stay visible.
