# Goblin Woods

Fantasy forest die-and-retry prototype on the `tile-board` template (`runMode`).

You start at the **bottom center** of a **7×7** grid and must **chart 6 moves** (↑↓←→) before running the path.

## Launch

```bash
./dev.sh up goblin-woods
# optional second port:
./dev.sh up goblin-woods 5175
```

## Loop

1. The map starts hidden except your start meadow.
2. Fill all 6 slots in the path planner (click pad or arrow keys / WASD).
3. Press **Run path** (or Enter). Moves play out in order; tiles reveal as you enter them.
4. Walls block but still reveal. Traps hurt. Goblins fight your attack power.
5. Find the sword/shield caches so later attempts can beat tougher enemies.
6. Reach the castle to win. On death, **Try again** keeps the revealed map and found gear.

Tiles may also have **side walls** on 0, 1, or 2 edges (mostly open). Crossing a walled edge wastes that programmed move.
