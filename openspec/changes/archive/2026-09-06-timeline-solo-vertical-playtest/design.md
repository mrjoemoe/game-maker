## Decisions

### 1. Time grows up

- **Choice:** Epoch at the bottom; later cards stack upward. Branches are columns. Rows 1–20 are global depth from epoch (the 20-card path cap).
- **Why:** Matches “timelines going up” and makes the 20-card cap visible.
- **Alternatives:** Left-to-right (current); per-branch 1–20 counters (hides the shared path cap).

### 2. Solo is a config mode, not a second prototype

- **Choice:** `timeline.playerCount` defaults to 1 on `core/timeline`. The playtest shows a 1-player badge. Future edits stay on this variant.
- **Why:** Designer asked for a 1-player mode to keep iterating without splitting games yet.
