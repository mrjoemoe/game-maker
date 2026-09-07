## Why

Merger currently splices the incoming head in as an extra parent of the destination card, so the join looks like a T into the destination stem. The join should be a line from the end of branch A to the end of branch B: A stops, B can still grow.

## What Changes

- Merger always joins **head to head** (clicking any card on a branch uses that branch’s head).
- Incoming branch is marked ended; destination head stays a head and may still grow.
- No extra parent/child on the destination card (no confluence splice).
- Merge wire runs end-to-end, not along the destination stem.
- Playing or forking from an ended branch is refused.

## Impact

- **modified:** timeline engine (Merger)
- **modified:** playtest wires / targeting copy
- **modified:** `core/timeline` (device summary) and Timeline Game rulebook
- **reused:** Merger device (same id, clearer join)
