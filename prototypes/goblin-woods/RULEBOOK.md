# Goblin Woods — Rulebook

Living rules for the Goblin Woods playtest. Agents must keep this file in sync when gameplay rules change.

## Goal

Reach the **Castle** by programming perfect action+move paths through a hidden forest. Learn the map across failed attempts, then use gear from the **Mage** to pass hazards.

## Setup

- 7×7 board. Most tiles start face-down; your starting tile is face-up.
- You begin on the **Mage** (bottom center).
- Inventory starts **empty**.
- **New map** rebuilds the session and re-rolls random **side walls** (terrain layout from the prototype stays the same).
- **Try again** (soft reset) returns you to the start with full HP, keeps revealed tiles and discovered items, and keeps the same wall layout.

## How a turn works

1. Chart a path of **1 to 6** steps (you may run early with fewer than 6).
2. Each step is **Action → Move** (orthogonal: up / down / left / right).
3. Press **Run** to execute the charted steps in order.
4. If you are still playing when the chart ends, you may chart another path from your current position.

### Actions

| Action | When it is legal |
|--------|------------------|
| **No action** | Always (just move). |
| **Take [item] from Mage** | You must be standing on an **unresolved Mage**. Grants the item and resolves that Mage (one gift per Mage per map). |
| **Use [item]** | You must hold the item (or have queued a Take for it earlier in this same chart). The use must match the upcoming move (see Items). |

If an action does not fit the situation, the run **ends immediately** (path over) and that step’s move does not happen.

## Safe ground vs hazards

- **Meadow**, **Forest**, and **Mage** are safe to step onto.
- Other tiles end the path unless you **Use** the matching pass item on that step (see table).
- **Sword/Shield caches** still end the path for now (no special pass). Collecting from caches is not active; gear comes from the Mage.

## Side walls

Tiles may have walls on one or more edges.

- Leaving through a wall on **your current tile** ends the path and does **not** reveal the next tile.
- Bumping a wall only on the **next** tile ends the path and **does** reveal that tile.
- **Sledgehammer**: Use it on a step whose crossing is blocked by a side wall to smash that edge, then move. Using it with no wall fails the run.

## Items and pass tiles

| Tile | Pass item (must **Use** that step) |
|------|-------------------------------------|
| Pit | Makeshift Bridge |
| River | Rope Bridge |
| Thicket | Machete |
| Snare | Knife |
| Goblin | Sword |
| Brute | Spear |
| Villain | Charm |
| Castle | Sneak (**wins** the run) |
| Sword Cache / Shield Cache | — (path over) |

Other listed items (e.g. Shield) may grant bonuses when held; the Mage can give any item in the game list.

Holding a pass item is **not** enough — you must **Use** it on the step you enter that tile.

## Winning and losing

- **Win**: Use **Sneak**, then move onto the **Castle**.
- **Lose (path over)**: Wrong action, blocked side wall without sledgehammer, stepping onto a hazard/cache/castle without the matching Use, or similar failures. The bump message explains why.

## Tips

- Take what you need from the Mage on your first charted step, then Use it later in the same plan (the planner treats earlier Takes as available inventory).
- Short charts are fine for scouting; commit only as far as you trust.
