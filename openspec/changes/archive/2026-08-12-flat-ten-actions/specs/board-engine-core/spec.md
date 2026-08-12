## MODIFIED Requirements

### Requirement: Programmed path length
A run-mode definition MAY set `programLength` (default 10) as the maximum number of atomic actions in one program. The engine SHALL accept a `runProgram` with between 1 and `programLength` actions (inclusive) and SHALL stop applying further actions once the run is no longer playing. Empty programs and programs longer than `programLength` SHALL be rejected.

#### Scenario: Program stops after path-over
- **WHEN** a programmed action ends the run as lost
- **THEN** remaining actions in that program are not applied

#### Scenario: Short program is accepted
- **WHEN** a runProgram with fewer than `programLength` actions (but at least one) is applied
- **THEN** those actions execute in order without requiring the remaining slots

### Requirement: Atomic program actions
Each programmed step SHALL be a single atomic action. Orthogonal moves SHALL be actions (`move` with direction up/down/left/right). Taking from the Mage, buying from a shop, using an item, traveling to a portal, and extracting SHALL each be one action. Collecting coins SHALL NOT be a programmed action; coins are gathered automatically on safe landing.

#### Scenario: Move costs one slot
- **WHEN** the hero programs a single down move
- **THEN** that program has length 1 and moving down executes without a separate paired action

#### Scenario: Grab then move uses two slots
- **WHEN** the hero programs takeFromMage then move right
- **THEN** both consume action slots and execute in order

#### Scenario: Coins are not charted
- **WHEN** the hero moves onto a cell with coins and the run stays playing
- **THEN** coins are collected without requiring a coin action in the program

### Requirement: Use item arms the next move
Using an item as a programmed action SHALL arm that item for the next move action. The following move SHALL apply wall-breaking / pass-item rules for that item, then move. Programming a non-move action while an item is armed, or ending the program still armed, SHALL end the run as lost.

#### Scenario: Use then move crosses a wall
- **WHEN** the hero programs useItem (sledgehammer) then move across a walled edge
- **THEN** the edge clears and the move proceeds, consuming the item

#### Scenario: Use without move paths over
- **WHEN** the hero programs useItem as the last action with no following move
- **THEN** the run is lost after that program with an unused-item message

## REMOVED Requirements

### Requirement: Action-then-move program steps
