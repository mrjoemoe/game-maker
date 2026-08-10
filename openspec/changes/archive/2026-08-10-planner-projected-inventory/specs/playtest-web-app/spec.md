## MODIFIED Requirements

### Requirement: Path planner UI
When run mode is enabled, the playtest app SHALL provide a side path planner to queue exactly `programLength` action+move pairs and execute them in order (action then move), stopping when the run ends. The UI SHALL let the player choose each step’s action (`none`, take from Mage, or use an item) and move direction. Each slot SHALL display the action summary and move. When composing a later step, Use-item actions SHALL be enabled for items in the current inventory and for items taken via earlier queued `takeFromMage` steps in the same program.

#### Scenario: Run path executes queued moves
- **WHEN** the player fills all program slots and activates run path
- **THEN** the app applies those action+move pairs in order until the program finishes or the run ends

#### Scenario: Full program required before run
- **WHEN** fewer than `programLength` complete action+move pairs are set
- **THEN** Run path stays disabled

#### Scenario: Slot shows use-item then north
- **WHEN** the player sets a step to use the sword and move up
- **THEN** that slot shows both the use-sword action and the up move

#### Scenario: Take then use in the same plan
- **WHEN** the player queues takeFromMage for an item in an earlier slot
- **THEN** Use for that item is available when composing a later slot in the same program
