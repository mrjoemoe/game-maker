## Why

Players need a mid-map mobility option that rewards exploration without skipping fog of war.

## What Changes

- Place four numbered portal tiles (Portal 1–4) on random meadows
- Portals are safe to step onto
- Program actions Travel to Portal 1–4 teleport from a portal to another portal only if the destination is already face-up
- Travel replaces that step’s orthogonal move; update planner actions and rulebook

## Impact

- Engine: portal effect, travelToPortal action
- Web: PathPlanner, TileView
- Prototype: Goblin Woods config + RULEBOOK
- Specs: board-engine-core, playtest-web-app, template-prototype-model
