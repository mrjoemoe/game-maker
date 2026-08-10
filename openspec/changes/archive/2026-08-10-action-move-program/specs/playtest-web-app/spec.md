## MODIFIED Requirements

### Requirement: Path planner UI
When run mode is enabled, the playtest app SHALL provide a side path planner to queue exactly `programLength` action+move pairs and execute them in order (action then move), stopping when the run ends. The UI SHALL let the player choose each step’s action (`none`, take from Mage, or use an item) and move direction. Each slot SHALL display the action summary and move.

#### Scenario: Run path executes queued moves
- **WHEN** the player fills all program slots and activates run path
- **THEN** the app applies those action+move pairs in order until the program finishes or the run ends

#### Scenario: Full program required before run
- **WHEN** fewer than `programLength` complete action+move pairs are set
- **THEN** Run path stays disabled

#### Scenario: Slot shows use-item then north
- **WHEN** the player sets a step to use the sword and move up
- **THEN** that slot shows both the use-sword action and the up move

### Requirement: Mage item picker
The playtest app SHALL NOT show an interactive Mage item-picker modal. Taking an item from the Mage SHALL be done by programming a takeFromMage action while on the Mage tile.

#### Scenario: Picker appears on Mage
- **WHEN** the hero steps onto an unresolved Mage during path execution
- **THEN** no item-picker dialog is shown
