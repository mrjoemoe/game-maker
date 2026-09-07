# Timeline Game — Rulebook

Living rules for the Timeline Game playtest. You are a time traveler repairing the past. This playtest is **1-player** mode.

## Goal

Each player has 3 objectives. Complete all 3 to win. An objective is a **person**, **place**, and **thing** that must all exist on one continuous timeline. When they do, **claim** that timeline. If the trio still holds at the start of your next turn, the objective is complete.

## Setup

- **1-player** playtest (further edits target this mode).
- The **Prime** timeline starts at **Epoch** (bottom of the timestream; later cards stack **up**. Rows **1–20** mark depth toward the 20-card cap).
- Prime has a branch mat for society (culture, science, politics) and **no crystals**.
- Three facedown piles sit beside the timestream: **Omega events** (yellow backs), **action cards** (green backs), and **blueprints**.
- Draw 2 action cards from the green pile at the start of each turn. Hand limit 7.
- Omega events never go into your hand. Blueprints enter your hand only when you play **Draw Blueprint**.
- Parts, minerals, and crystals live on your **player mat**, not in hand.
- You may hold up to **3 devices**. A **blueprint** must be on your mat before you build a device (skipped in debug).

## Turn

1. Draw 2 action cards from the green pile (max 7 in hand).
2. If you are **not** at a branch head, you may move up to **3** spaces toward the head. Cards you pass **resolve** (gain resources, society, and so on). If you stop on a head after 1–2 spaces, you may play only **1** action card.
3. If you are at a head (or creating a new branch), play up to **2** action cards.
4. You may play action cards only at the head of a branch, or by creating a new branch from an earlier moment.

Debug mode ignores these limits so you can walk anywhere and play onto any node.

## Cards

Cards live in three piles:

- **Omega events** (yellow backs, 30 cards): person, place, and thing. These stay in their own pile and are placed on the timestream when you play **Random Event**.
- **Action cards** (green backs): society, invention, resource, Random Event, and Draw Blueprint. These are the cards that go into your hand.
- **Blueprints:** their own pile. Playing **Draw Blueprint** adds the top blueprint to your hand.

- **Random Event:** Play it onto a timeline moment. Draw the top Omega event and place *that* card there. The Random Event card goes back to the action pile.
- **Draw Blueprint:** Play it onto the timeline. Draw the top blueprint into your hand.
- **Resources:** Playing or passing Get Parts / Get Minerals adds 1–3 of that resource to your mat, multiplied by earlier matching inventions on the path (Education → parts, Infrastructure → minerals).
- **Society:** Culture, science, and politics stack on the branch. Device costs use the **path total** from epoch to your piece. Mats show the branch’s own dice. Society is not spent.
- **Inventions:** Place earlier in a timeline to multiply later matching resources.

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

Build with parts, minerals, crystals, and culture / science / politics on the path from epoch to you. The crystal number is the cost to **run** the device. Each blueprint tracks remaining uses with tokens. Debug mode does not spend build costs or crystals to run; a slotted device still spends a use.

| | Device | Cost | Effect |
|---|---------|------|--------|
| A | **Brancher** | 2 parts, 5 minerals, 2 crystals · C 4 / S 2 / P 0 · 2 uses · 12 blueprints | Fork a new timeline from a chosen moment **and lay an action card from your hand** as the first card on that branch. |
| B | **Reverser** | 3 parts, 1 mineral, 1 crystal · C 5 / S 5 / P 5 · 3 uses · 12 blueprints | Jump to an ancestor. |
| C | **Relocator** | 3 parts, 3 minerals, 3 crystals · C 2 / S 4 / P 1 · 1 use · 6 blueprints | Move a fork to a new parent. |
| D | **Pruner** | 3 parts, 3 minerals, 4 crystals · C 3 / S 3 / P 3 · 1 use · 3 blueprints | Cut a **loose** tail from the head down to the latest junction (fork, merge-in, or preserved card). Joined-at-both-ends timelines cannot be pruned. Return cut cards to their matching piles. |
| E | **Merger** | 5 parts, 1 mineral, 4 crystals · C 1 / S 1 / P 5 · 1 use · 3 blueprints | Join the **heads** of two timelines. The first timeline ends there; the second can still grow. No third branch. |
| F | **Rewriter** | 1 part, 3 minerals, 1 crystal · C 1 / S 3 / P 1 · 3 uses · 24 blueprints | Swap a card in your hand with a card already on the timeline. Cannot swap Omega events into the hand. |
| G | **Preserver** | 1 part, 1 mineral, 5 crystals · C 1 / S 1 / P 1 · 1 use · 3 blueprints | Lock the cards already laid on that timeline **up to the chosen moment**. Later cards can still be played and edited. |
| H | **Jumper** | 1 part, 1 mineral, 1 crystal · C 1 / S 1 / P 1 · 3 uses · 12 blueprints | Skip ahead up to 3 spaces. |


## Debug playtest

Debug is **on** by default in this prototype. You may play any card, draw from the action pile, take crystals, and fire any device without paying crystals. A slotted device still spends a use. Use it to prove movement and the eight devices before tightening rules.
