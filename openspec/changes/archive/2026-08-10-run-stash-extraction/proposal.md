## Why

Items currently persist across soft resets as soon as they are discovered, so there is no risk to gear and little reason to leave a run early. Players need a stash that only updates when they extract (or win), with loadout risk and consumable uses, while the castle remains the true win.

## What Changes

- **BREAKING**: Replace “discovered items always seed inventory on soft reset” with a persistent **stash** and a per-run **loadout**. New maps start with an empty stash; the player chooses which stash items to take into each attempt.
- Items taken into a run leave the stash. On path-over / fail, everything currently on the person is lost. Soft reset does **not** restore lost loadout or mid-run finds.
- Using a pass item (or other use-item action) **consumes** that item from the run inventory.
- Add an **extraction** tile effect. The four corner cells of the board are always extraction points and always face up. Stepping onto extraction banks the current run inventory into the stash and ends the attempt as extracted (not a win).
- Winning at the **castle (goal)** still wins the run and also banks the run inventory into the stash.
- Goblin Woods: place extraction on the four corners; place the castle at a **random** eligible cell (not fixed top-center). Mage / take-from-Mage still grants into run inventory only until extract or win.

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `board-engine-core`: stash + loadout lifecycle; consume-on-use; extraction effect; win/extract banking; soft/full reset behavior
- `playtest-web-app`: stash vs run inventory UI; pre-run loadout selection; extract outcome banner; show face-up corner extractions
- `template-prototype-model`: Goblin Woods corners as extraction; random castle placement

## Impact

- `packages/engine` run/game state (`discoveredItemIds` → stash), step resolution, soft/full reset, program `useItem` consumption
- `packages/web` HUD, inventory panel, loadout gate before `runProgram`, banners for extracted vs won/lost
- `prototypes/goblin-woods` board overrides and castle randomization
