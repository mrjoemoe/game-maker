## Why

After the first attempt, soft reset keeps the Mage resolved, so later runs cannot take an item. With stash/loadout risk, each run needs a fresh Mage grant opportunity.

## What Changes

- Soft reset clears Mage resolved flags (like enemies), so takeFromMage works every attempt.
- Within a single attempt the Mage remains one-shot after a successful take.

## Impact

- `board-engine-core`, soft reset in engine, Mage tests
