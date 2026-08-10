## ADDED Requirements

### Requirement: Extract action ends the chart
When composing a path, the playtest app SHALL offer an Extract program action. After a step whose action is Extract is queued, the UI SHALL NOT allow selecting further steps (append stays disabled until Undo/Clear removes that terminal Extract).

#### Scenario: Extract is available as an action
- **WHEN** the player composes a path step
- **THEN** Extract is listed among step actions

#### Scenario: No steps after Extract
- **WHEN** the player queues a step with the Extract action
- **THEN** further action/move append controls stay disabled until that step is undone or the path is cleared

## MODIFIED Requirements

### Requirement: Path planner UI
When run mode is enabled, the playtest app SHALL provide a side path planner to queue up to `programLength` action+move pairs and execute them in order (action then move), stopping when the run ends. The UI SHALL let the player choose each step’s action (`none`, take from Mage, use an item, or extract) and move direction. Each slot SHALL display the action summary and move. When composing a later step, Use-item actions SHALL be enabled for items in the current inventory and for items taken via earlier queued `takeFromMage` steps in the same program, minus items used in earlier queued `useItem` steps. Run path SHALL be enabled when at least one complete pair is queued (not only when all slots are filled). A queued Extract step SHALL prevent appending further steps.

#### Scenario: Run path executes queued moves
- **WHEN** the player fills all program slots and activates run path
- **THEN** the app applies those action+move pairs in order until the program finishes or the run ends

#### Scenario: Full program required before run
- **WHEN** fewer than `programLength` complete action+move pairs are set but at least one pair is queued
- **THEN** Run path is enabled so the player can end the chart early

#### Scenario: Slot shows use-item then north
- **WHEN** the player sets a step to use the sword and move up
- **THEN** that slot shows both the use-sword action and the up move

#### Scenario: Take then use in the same plan
- **WHEN** the player queues takeFromMage for an item in an earlier slot
- **THEN** Use for that item is available when composing a later slot in the same program

#### Scenario: Empty program cannot run
- **WHEN** no action+move pairs are queued
- **THEN** Run path stays disabled

#### Scenario: Extract locks further slots
- **WHEN** the player queues Extract as a step action
- **THEN** additional steps cannot be appended until Undo or Clear
