## Why

Preserver currently locks an entire timeline, including cards laid after the lock. It should freeze only what already exists up to the chosen moment so the branch can still grow.

## What Changes

- Preserver locks the chosen branch from its root through the clicked card.
- Cards played after that moment stay unlocked and editable.
- Yellow wash covers the locked prefix, not the whole column.
- Relocator/Pruner still refuse a branch that has a preserved prefix; Rewriter refuses only locked cards.

## Impact

- **modified:** timeline engine (Preserver)
- **modified:** playtest lock wash
- **modified:** `core/timeline` summary and Timeline Game rulebook
- **reused:** Preserver device
