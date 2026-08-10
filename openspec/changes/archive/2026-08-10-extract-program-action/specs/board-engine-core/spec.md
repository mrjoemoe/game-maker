## ADDED Requirements

### Requirement: Extract program action
A run program MAY include an `extract` action. While standing on an extraction tile, `extract` SHALL merge the run inventory into the stash, clear the run inventory, set status to `extracted`, and SHALL NOT apply the step’s move. Off an extraction tile, `extract` SHALL lose the run with a reported reason and SHALL NOT move.

#### Scenario: Extract while on extraction
- **WHEN** the hero is on an extraction tile and the step action is extract
- **THEN** carried items are banked to the stash, status is extracted, and the hero does not move for that step

#### Scenario: Extract off extraction fails
- **WHEN** the hero is not on an extraction tile and the step action is extract
- **THEN** the run is lost and the hero does not move

## MODIFIED Requirements

### Requirement: Extraction banks run inventory
A tile type MAY declare effect kind `extraction`. Stepping onto an extraction tile SHALL be a safe move (like Mage): reveal if needed, move the hero onto it, and keep the run playing. Banking and ending as `extracted` SHALL occur only via the `extract` program action while standing on that tile. Extraction is not the win condition.

#### Scenario: Step onto extraction stays playing
- **WHEN** the hero steps onto an extraction tile without an extract action on that step
- **THEN** the hero arrives on the tile, the run stays playing, and the stash is unchanged

#### Scenario: Extract with gathered gear
- **WHEN** the hero stands on extraction and programs extract while holding items
- **THEN** those items are in the stash, the run inventory is empty, and the run status is extracted

#### Scenario: Extract empty-handed
- **WHEN** the hero stands on extraction and programs extract with an empty run inventory
- **THEN** the stash is unchanged and the run status is extracted

### Requirement: Safe path tiles only
In run mode, stepping onto a tile whose effect is not empty, mage, or extraction SHALL end the run as lost and report why (e.g. found a Castle — path over), unless that step’s action used the tile’s `passItemId`. Full-cell wall tiles without a matching used pass item SHALL reveal, keep the hero in place, and end the run as lost. Mage and extraction tiles are safe to step onto. Extraction banking requires a later extract action.

#### Scenario: Castle ends the path
- **WHEN** the hero steps onto a goal/castle tile without using its pass item that step
- **THEN** the run status becomes lost and the bump message states the castle ended the path

#### Scenario: Extraction does not path-over
- **WHEN** the hero steps onto an extraction tile
- **THEN** the run stays playing and does not become lost from that tile’s effect alone

### Requirement: Action-then-move program steps
A run program SHALL consist of 1 to `programLength` steps, each pairing a program action with an orthogonal move. Each step SHALL apply the action first, then the move. If the action is invalid for the current situation, the run SHALL be lost with a reported reason and the move SHALL not apply. Successful `useItem` actions SHALL consume the item from the run inventory. A successful `extract` action SHALL end the run as extracted so the move does not apply.

#### Scenario: Take from Mage while standing on Mage
- **WHEN** the hero is on an unresolved Mage and the step action is takeFromMage with a valid item id
- **THEN** the item is granted to the run inventory, the Mage is resolved, and the move proceeds

#### Scenario: Take from Mage off a Mage tile fails
- **WHEN** the hero is not on an unresolved Mage and the step action is takeFromMage
- **THEN** the run is lost and the hero does not move

#### Scenario: Use pass item then enter matching tile
- **WHEN** the hero holds an item, uses it as the step action, and moves onto a tile whose passItemId is that item
- **THEN** the hero traverses that tile (goal wins and banks) instead of pathing over, and the item is consumed

#### Scenario: Use item that does not match the destination fails
- **WHEN** the hero uses an item whose pass/break effect does not apply to the upcoming move
- **THEN** the run is lost before or without a successful traverse

#### Scenario: Extract ends before the move
- **WHEN** the hero is on extraction and the step action is extract with any move
- **THEN** the run becomes extracted and the move is not applied
