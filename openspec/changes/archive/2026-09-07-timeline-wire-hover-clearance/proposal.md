## Why

Fork and merge wires still share gutters, so cyan and dashed lines stack. Hovering a card does not isolate a connector, and a merge into Branch 4 is hard to see once the destination has grown.

## What Changes

- Hovering a wire brings that connector to the front and dims the others.
- Parallel wires SHALL NOT share a corridor; later wires take a neighboring channel or letter-jump.
- Merge wires show an arrow into the continuing head and name which timeline joins which.

## Impact

- **modified:** Timeline playtest canvas / wire router
- **reused:** `core/timeline`, Merger rules, existing stem/fork/merge colors
