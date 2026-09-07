# Timeline Game — Rulebook

Living rules for the Timeline Game playtest. You are a time traveler repairing the past. This playtest is **1-player** mode.

## Goal

Each player has 3 objectives. Complete all 3 to win. An objective is a **person**, **place**, and **thing** that must all exist on one continuous timeline. When they do, **claim** that timeline. If the trio still holds at the start of your next turn, the objective is complete.

## Setup

- **1-player** playtest (further edits target this mode).
- The **Prime** timeline starts at **Epoch** (bottom of the timestream; later cards stack **up**. Rows **1–20** mark depth toward the 20-card cap).
- Prime has a branch mat for society (culture, science, politics) and **no crystals**.
- Draw 2 action cards at the start of each turn. Hand limit 7.
- Parts, minerals, and crystals live on your **player mat**, not in hand.
- You may hold up to **3 devices**. A **blueprint** must be on your mat before you build a device (skipped in debug).

## Turn

1. Draw 2 action cards (max 7 in hand).
2. If you are **not** at a branch head, you may move up to **3** spaces toward the head. Cards you pass **resolve** (gain resources, society, and so on). If you stop on a head after 1–2 spaces, you may play only **1** action card.
3. If you are at a head (or creating a new branch), play up to **2** action cards. If you play at least 1, also play a **random event**.
4. You may play action cards only at the head of a branch, or by creating a new branch from an earlier moment.

Debug mode ignores these limits so you can walk anywhere and play onto any node.

## Cards

Action cards include events (person / place / thing), resource gathers, inventions, society, blueprints, and “draw a random event.”

- **Resources:** Playing or passing Get Parts / Get Minerals adds 1–3 of that resource to your mat, multiplied by earlier matching inventions on the path (Education → parts, Infrastructure → minerals).
- **Society:** Culture, science, and politics stack on the branch. Device costs use the **path total** from epoch to your piece. Mats show the branch’s own dice. Society is not spent.
- **Inventions:** Place earlier in a timeline to multiply later matching resources.
- **Random events:** Negative, chaos, blank, positive, transport, and slip effects.

## Player mat

Tracks **parts**, **minerals**, and **crystals**. Three device slots. Blueprints must sit on the mat before a device is built.

## Branch mats

Every new branch gets a numbered mat at its base:

- Dice for culture, science, politics (from society cards on that branch).
- A **crystal** die. New branches start with 1 crystal; you also gain 1 crystal when you create the branch.
- Prime has no crystals.
- Passing a fork mat with a crystal remaining lets you take it.

## Branch limits

- Prime: at most **20** cards.
- Any other branch: at most **10** cards.
- Any continuous path from epoch: at most **20** cards.
- At most **12** branches.

## End of time

If you reach a path of 20 cards, gain **2 crystals** and your turn ends. Next turn choose:

1. Stay — gain 1 crystal and take no actions.
2. Use **Reverser** if you have one.
3. Roll for a numbered branch mat that exists and go there (reroll misses).

## Devices

Build with parts, minerals, **1 crystal**, and the path’s culture / science / politics. Placeholder costs:

| | Device | Effect |
|---|---------|--------|
| A | **Brancher** | Fork a new timeline from a chosen moment **and lay an action card from your hand** as the first card on that branch. High minerals, med parts, low society. |
| B | **Reverser** | Jump to an ancestor. High society, med parts. |
| C | **Relocator** | Move a fork to a new parent. Science > culture > politics. |
| D | **Pruner** | Delete a non-prime branch (and its descendant forks); return event cards to decks. Medium everything. |
| E | **Merger** | End one timeline into another: branch 1 stops at the join and play continues on branch 2. No third branch. High parts and politics. |
| F | **Rewriter** | Replace one played action card; the old card returns to its deck. |
| G | **Preserver** | Lock a timeline so others cannot manipulate it. Low everything. |
| H | **Jumper** | Skip ahead up to 3 spaces. Low everything. |

Devices have limited uses. Debug mode does not spend costs or uses.

## Debug playtest

Debug is **on** by default in this prototype. You may play any card, draw from any deck, take crystals, and fire any device without paying. Use it to prove movement and the eight devices before tightening rules.
