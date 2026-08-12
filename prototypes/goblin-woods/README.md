# Goblin Woods

Fantasy forest die-and-retry prototype on the `tile-board` template (`runMode`).

You start at the **bottom center** of a **7×7** grid. Chart up to **10 actions** (moves included), gather coins, buy or take gear, extract to stash, and win the castle with a sledgehammer.

## Launch

```bash
./dev.sh up goblin-woods
# optional second port:
./dev.sh up goblin-woods 5175
```

## Loop

1. The map starts hidden except start (Mage) and the four extraction corners.
2. Optionally commit a stash loadout, then chart steps in the path planner.
3. Press **Run**. Moves play out; tiles reveal as you enter them.
4. Collect coins on safe landings; buy at shops or take from the Mage.
5. Extract at a corner to bank gear, or reach the castle with a sledgehammer to win.
6. On death, **Try again** keeps the revealed map, stash, and coin wallet.

Tiles may also have **side walls** on 0, 1, or 2 edges (mostly open). Crossing a walled edge ends the path unless you use a sledgehammer.
