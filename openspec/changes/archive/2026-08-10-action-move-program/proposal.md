## Why

The game is about committing to a perfect plan. Moves alone are not enough — each step must declare an action (use an item, take from the Mage) before the move, and a mismatched action fails the run.

## What Changes

- Programs are `programLength` pairs of **action then move** (not bare directions).
- Actions: `none`, `takeFromMage(itemId)`, `useItem(itemId)`. Wrong action for the situation ends the run.
- Pass items only work when explicitly used on the step that enters their tile; inventory alone is not enough.
- Add sledgehammer (`breaksSideWalls`) to smash the side wall on the upcoming crossing.
- Goblin Woods start cell is the Mage (no longer meadow); remove interactive Mage picker — taking gear is a programmed action.
- Path planner UI builds action+move slots.

## Impact

- `board-engine-core`: ProgramStep, action resolution, armed use-item moves, sledgehammer
- `playtest-web-app`: PathPlanner / App program model; remove Mage modal
- `template-prototype-model`: start Mage + sledgehammer item
