## MODIFIED Requirements

### Requirement: Path planner UI
When run mode is enabled, the playtest app SHALL provide an action bank on the right of the board and a horizontal action track below the board (above inventory). The bank SHALL list left, up, down, and right in the same compact action list as take, buy, use, travel, and extract, without instructional lede copy and without a separate move pad. Clicking a bank action SHALL append it to the track left-to-right up to `programLength` (10 for Goblin Woods). The track SHALL highlight the executing action while running. Use-item actions SHALL be enabled for items held or taken/bought earlier in the queued program. Run SHALL be enabled with at least one queued action. A queued Extract SHALL prevent appending further actions. Collecting coins SHALL NOT appear as a bank action. The tile tally SHALL NOT sit in the action-bank column; it SHALL appear below inventory so the bank has vertical room for more choices.

#### Scenario: Direction appends to track
- **WHEN** the player clicks Right in the action bank
- **THEN** a move-right action appears as the next slot on the track below the board

#### Scenario: Run path executes queued moves
- **WHEN** the player fills the action track and activates Run
- **THEN** the app applies those atomic actions in order until the program finishes or the run ends

#### Scenario: Full program required before run
- **WHEN** fewer than `programLength` actions are queued but at least one is present
- **THEN** Run is enabled so the player can end the chart early

#### Scenario: Slot shows use-item then north
- **WHEN** the player appends Use sword then Up to the track
- **THEN** those slots show the use-sword action and the up move as consecutive actions

#### Scenario: Run path executes queued actions
- **WHEN** the player queues actions and activates Run
- **THEN** the app applies those atomic actions in order until the program finishes or the run ends

#### Scenario: Short program can run
- **WHEN** fewer than `programLength` actions are queued but at least one is present
- **THEN** Run is enabled

#### Scenario: Take then use in the same plan
- **WHEN** the player queues takeFromMage for an item earlier in the track
- **THEN** Use for that item is available later in the same program

#### Scenario: Empty program cannot run
- **WHEN** no actions are queued
- **THEN** Run stays disabled

#### Scenario: Extract locks further slots
- **WHEN** the player queues Extract
- **THEN** additional actions cannot be appended until Undo or Clear

#### Scenario: Moves share the action list
- **WHEN** the action bank is shown
- **THEN** directional moves appear among the other action buttons without a separate move pad or lede paragraph

#### Scenario: Tile tally is below inventory
- **WHEN** run mode is shown
- **THEN** the tile tally is not stacked under the action bank on the right
