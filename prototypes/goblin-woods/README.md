# Goblin Woods

Fantasy forest die-and-retry prototype on the `tile-board` template (`runMode`).

## Launch

```bash
./dev.sh up goblin-woods
# optional second port:
./dev.sh up goblin-woods 5175
```

## Loop

1. The map starts hidden except your start meadow.
2. Step onto adjacent tiles (click or arrow keys / WASD).
3. Walls block but still reveal. Traps hurt. Goblins fight your attack power.
4. Find the sword/shield caches so later attempts can beat tougher enemies.
5. Reach the castle to win. On death, **Try again** keeps the revealed map and found gear.
