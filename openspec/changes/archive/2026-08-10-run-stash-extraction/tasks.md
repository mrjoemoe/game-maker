## 1. Engine stash and loadout

- [x] 1.1 Replace `discoveredItemIds` with `stashItemIds`; add run status `extracted`; stop seeding inventory from discoveries on soft reset
- [x] 1.2 Add `commitLoadout` action that moves a subset of stash items into empty run inventory
- [x] 1.3 On lost run, discard run inventory; soft reset clears inventory and preserves stash; full reset clears stash
- [x] 1.4 Update engine unit tests for stash/loadout/fail/soft-reset behavior

## 2. Extraction, consume-on-use, and win banking

- [x] 2.1 Add tile effect `extraction`; stepping on it banks run inventory into stash, clears inventory, sets status `extracted`
- [x] 2.2 Consume used items from run inventory on successful `useItem` (pass traverse and breaksSideWalls)
- [x] 2.3 On goal win, bank remaining run inventory into stash after consuming the used pass item
- [x] 2.4 Mage/powerup grants add to run inventory only (not stash); update Mage soft-reset scenarios
- [x] 2.5 Update planner projected-inventory logic so queued `useItem` removes items from later slots
- [x] 2.6 Add/update engine tests for extract, consume, win-banking, and corner face-up helpers if any

## 3. Goblin Woods board

- [x] 3.1 Add extraction tile type; override four corners to extraction and face up
- [x] 3.2 Remove fixed castle override; place one castle randomly on an eligible non-start, non-corner cell (seeded for reproducibility)
- [x] 3.3 Ensure New map / full reset re-rolls castle placement with the new board seed

## 4. Playtest UI

- [x] 4.1 Show stash vs run inventory; loadout commit UI before running a path on a fresh attempt
- [x] 4.2 Extracted banner + try-again; adjust win/lose copy for lost gear vs banked stash
- [x] 4.3 Render extraction tile indicators (including always-visible corners)
- [x] 4.4 Reflect consume-on-use and projected inventory in the path planner

## 5. Verify and archive

- [x] 5.1 Run engine and web tests; smoke Goblin Woods loadout → Mage take → extract → soft reset → castle win path
- [x] 5.2 Archive the OpenSpec change into main specs
- [x] 5.3 Commit and push via archive-and-push
