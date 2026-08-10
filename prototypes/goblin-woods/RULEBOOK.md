# Goblin Woods — Rulebook

Living rules for the Goblin Woods playtest. Agents must keep this file in sync when gameplay rules change.

## Goal

Reach the **Castle** by programming action+move paths through a hidden forest. Extract gear to your stash, gather **coins**, and buy at **shops**. Win by breaking into the castle with a **Sledgehammer**.

## Setup

- 7×7 board. Most tiles start face-down; start and the four **Extraction** corners are face-up.
- You begin on the **Mage** (bottom center).
- **Stash** starts empty; **coins** start at 0. Loadout from stash is optional each attempt.
- **New map** re-rolls the seed: side walls, hazards, shops, castle, and coin stacks all regenerate.
- **Try again** (soft reset) returns you to start with full HP, keeps the revealed map, stash, and coin wallet; Mage refreshes; run inventory clears.

## Coins

- After the map is built, every cell rolls coins: **40%** 0, **30%** 1, **20%** 2, **10%** 3.
- Land safely on a cell (run stays playing, or you win) to collect its coins into your wallet and clear that cell.
- Path-over / death on a cell does **not** collect its coins.
- Coins are **kept without extracting**. Soft reset keeps the wallet; New map resets it to 0.

## Shops

- Three **Shop** tiles are placed on random meadows.
- Shops are safe to step onto.
- **Buy [item]** (3 coins) while standing on a shop adds that item to your **run inventory** (same catalog as the Mage). You may buy repeatedly.
- Bought gear is at risk until you **Extract** or win.

## How a turn works

1. Optionally **commit a loadout** from stash (or go empty-handed).
2. Chart a path of **1 to 6** steps (you may run early).
3. Each step is **Action → Move** (orthogonal).
4. Press **Run** to execute. Chart again from your new position if still playing.

### Actions

| Action | When it is legal |
|--------|------------------|
| **No action** | Always (just move). |
| **Take [item] from Mage** | Standing on an **unresolved Mage**. One take per attempt (Mage refreshes on Try again). |
| **Buy [item]** (3🪙) | Standing on a **Shop** with at least 3 coins. Repeatable. |
| **Use [item]** | You hold it (or took/bought it earlier in this chart). Must match the upcoming move. |
| **Extract** | Standing on an **Extraction** corner. Banks run inventory to stash and ends the attempt (not a win). Ends the chart — no further steps. |

If an action does not fit, the run **ends** (path over) and that step’s move does not happen.

## Safe ground vs hazards

- **Meadow**, **Forest**, **Mage**, **Shop**, and **Extraction** are safe to step onto.
- Other tiles end the path unless you **Use** the matching pass item that step.
- **Sword/Shield caches** still end the path (no pass).

## Side walls

- Leaving through a wall on **your** tile ends the path without revealing the next tile.
- A wall only on the **next** tile ends the path and reveals it.
- **Sledgehammer**: Use on a blocked crossing to smash that edge, then move. Required to enter the walled **Castle**.

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
| Castle | **Sledgehammer** (**wins**; castle has walls on all sides) |
| Sword Cache / Shield Cache | — (path over) |

Used items are **consumed**. Gear only returns to stash on **Extract** or **Castle win**.

## Winning and losing

- **Win**: Use **Sledgehammer** into the **Castle** (banks remaining run inventory).
- **Extract**: Bank run inventory at a corner; attempt ends without winning.
- **Lose**: Wrong action, walls, hazards without Use, etc. Run inventory is lost; stash and coins stay.

## Tips

- Scout short paths to grab coins, then Extract early to bank starter gear.
- Buy at shops when you need a pass item you did not take from the Mage.
- Plan Extract as the last step of a chart — the planner locks further slots after it.
