## Decisions

### 1. Timeline is a DAG with branch mats

- **Choice:** Nodes (`parentIds` / `childIds`) grouped into numbered branches. Each branch has a mat: culture, science, politics (derived from society cards on that branch) and a crystal pool (forks start at 1; primary has 0). Time flows left → right by depth.
- **Why:** Branch / merge / prune / relocate / preserve are graph edits; society and crystals are per-branch, not per-tile.
- **Alternatives:** Grid encoding (rejected).

### 2. Dummy board keeps GameDefinition stable

- **Choice:** Timeline variants still contribute a 1×1 unused board and a traveler piece.
- **Why:** Avoid a breaking union type for existing tile-board consumers.

### 3. Debug is the first playable loop

- **Choice:** `timeline.debugMode` defaults true. Debug skips device costs, crystal spend, blueprints, 3-device cap, hand size, and max branch lengths, but still performs the graph edits and shows mats/slots.
- **Why:** Designer asked to dial in movement and devices before card balance.

### 4. Device dock + targeting

- **Choice:** Persistent A–H dock. Each device enters cancelable targeting (click node/branch, then optional second click). Resources stay on the player mat, not in hand.
- **Why:** Usable playtest of all eight devices.

### 5. One feature-bundle for v1

- **Choice:** `core/timeline` owns template, placeholder catalog, and default devices. Extract cards later if a second variant appears.

### 6. Length and end of time (enforced only when debug is off)

- Primary ≤ 20 cards; other branches ≤ 10; any path from epoch ≤ 20 cards; ≤ 12 branches.
- Reaching end of time grants 2 crystals and ends the turn; next turn: stay (+1 crystal), Reverser, or roll onto an existing numbered branch mat.
