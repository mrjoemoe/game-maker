## MODIFIED Requirements

### Requirement: Soft reset preserves learned map and items
The engine SHALL provide a soft reset action that returns the hero to the start position, restores HP to max, clears the run inventory without changing the stash, increments the attempt count, and clears enemy and Mage resolved flags, while preserving revealed tile faces, powerup resolved state, and stash contents. A full reset action SHALL clear the stash, rebuild the board, and return run state to the initial definition; when run mode is enabled and the board uses generated side walls, full reset SHALL re-roll the side-wall seed so the new map’s wall layout can differ.

#### Scenario: Retry after defeat keeps the map
- **WHEN** a run ends lost and a soft reset is applied
- **THEN** the hero returns to start with full HP, previously revealed tiles stay face up, the run inventory is empty, and the stash is unchanged from before that failed attempt’s loadout (items taken into the failed run remain lost)

#### Scenario: Full reset clears stash
- **WHEN** a full reset action is applied
- **THEN** tile faces, hero position, run state, and stash all return to the initial definition

#### Scenario: Full reset rerolls side walls in run mode
- **WHEN** a run-mode game with generated side walls is fully reset
- **THEN** the new board is built with a new side-wall seed (not necessarily the previous seed)

#### Scenario: Soft reset after extract keeps banked stash
- **WHEN** a run ends extracted with banked items and a soft reset is applied
- **THEN** those items remain in the stash and the run inventory is empty pending a new loadout

#### Scenario: Soft reset refreshes Mage
- **WHEN** a Mage was resolved in a prior attempt and a soft reset is applied
- **THEN** that Mage cell is unresolved again so takeFromMage can succeed on the new attempt

### Requirement: Mage grants a chosen item
Mage tiles SHALL NOT open an interactive pending choice on step. Granting SHALL occur only via a `takeFromMage` program action while standing on an unresolved Mage. Stepping onto a Mage tile SHALL be a safe move. Granted items SHALL enter the run inventory only; they SHALL NOT enter the stash until the hero extracts or wins. Soft reset SHALL clear Mage resolved state so each attempt can take from the Mage again. Within a single attempt, a successful take resolves the Mage until the next soft or full reset.

#### Scenario: First visit to Mage opens a choice
- **WHEN** the hero stands on an unresolved Mage and programs takeFromMage
- **THEN** choosing an item via that action grants it (no modal pending choice)

#### Scenario: Choosing an item grants to run inventory only
- **WHEN** takeFromMage succeeds for an item id
- **THEN** that item is in the run inventory, not in the stash, and the Mage cell is resolved

#### Scenario: Soft reset without extract loses Mage grant but refreshes Mage
- **WHEN** a soft reset runs after an item was granted by the Mage but the run did not extract or win
- **THEN** that item is not in the stash, the new attempt’s inventory does not include it unless loaded again from stash, and the Mage is unresolved again

#### Scenario: Stepping onto Mage does not pause for a picker
- **WHEN** the hero moves onto an unresolved Mage without a takeFromMage action on that step
- **THEN** the hero arrives on the Mage, the run stays playing, and no pending item choice is set
