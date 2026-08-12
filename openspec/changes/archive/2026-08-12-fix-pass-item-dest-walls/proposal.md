## Why

Using a matching pass item (e.g. Makeshift Bridge into a Pit) fails when the destination tile has a side wall on the entry face. Players cannot combine sledgehammer and pass item in one step, so those tiles are unfairly impassable.

## What Changes

- Matching pass-item Use clears/ignores the destination entry wall for that crossing so the traverse can succeed.
- Origin-tile exit walls still require Sledgehammer (or a clear exit).
- Rulebook clarifies this interaction.

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `board-engine-core`: Pass-item Use succeeds past destination entry walls when the item matches the destination tile.
- `goblin-woods-variant`: Rulebook documents pass items vs side walls.

## Impact

- `packages/engine` use/step logic + tests
- `prototypes/goblin-woods/RULEBOOK.md`
