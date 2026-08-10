## MODIFIED Requirements

### Requirement: Programmed path length
A run-mode definition MAY set `programLength` (default 6) as the maximum number of steps in one program. The engine SHALL accept a `runProgram` with between 1 and `programLength` steps (inclusive) and SHALL stop applying further steps once the run is no longer playing. Empty programs and programs longer than `programLength` SHALL be rejected.

#### Scenario: Program stops after path-over
- **WHEN** a programmed step ends the run as lost
- **THEN** remaining steps in that program are not applied

#### Scenario: Short program is accepted
- **WHEN** a runProgram with fewer than `programLength` steps (but at least one) is applied
- **THEN** those steps execute in order without requiring the remaining slots

### Requirement: Action-then-move program steps
A run program SHALL consist of 1 to `programLength` steps, each pairing a program action with an orthogonal move. Each step SHALL apply the action first, then the move. If the action is invalid for the current situation, the run SHALL be lost with a reported reason and the move SHALL not apply.

#### Scenario: Take from Mage while standing on Mage
- **WHEN** the hero is on an unresolved Mage and the step action is takeFromMage with a valid item id
- **THEN** the item is granted and discovered, the Mage is resolved, and the move proceeds

#### Scenario: Take from Mage off a Mage tile fails
- **WHEN** the hero is not on an unresolved Mage and the step action is takeFromMage
- **THEN** the run is lost and the hero does not move

#### Scenario: Use pass item then enter matching tile
- **WHEN** the hero holds an item, uses it as the step action, and moves onto a tile whose passItemId is that item
- **THEN** the hero traverses that tile (goal wins) instead of pathing over

#### Scenario: Use item that does not match the destination fails
- **WHEN** the hero uses an item whose pass/break effect does not apply to the upcoming move
- **THEN** the run is lost before or without a successful traverse
