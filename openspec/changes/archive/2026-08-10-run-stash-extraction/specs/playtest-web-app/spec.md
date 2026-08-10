## ADDED Requirements

### Requirement: Stash and loadout UI
When run mode is enabled, the playtest app SHALL show the persistent stash separately from the current run (on-person) inventory. Before starting a program on a fresh attempt (empty run inventory after new map or soft reset), the UI SHALL let the player choose any subset of stash items as the loadout and commit that loadout into the run inventory. Committing an empty loadout SHALL be allowed (start with no items).

#### Scenario: Empty stash on new map
- **WHEN** a new Goblin Woods map starts
- **THEN** the stash panel shows no stored gear and the run inventory is empty

#### Scenario: Player commits a loadout
- **WHEN** the stash holds a knife and the player selects it and commits the loadout
- **THEN** the knife appears in the run inventory and no longer in the stash

### Requirement: Extracted outcome banner
When a run ends with status extracted, the app SHALL show an extracted banner (distinct from win/lose) stating that carried gear was banked, and SHALL offer a try-again control that soft resets while preserving the revealed map and stash.

#### Scenario: Retry after extract
- **WHEN** a run is extracted and the player selects try again
- **THEN** the hero returns to start with the map still revealed, banked items remain in the stash, and a new loadout can be chosen

## MODIFIED Requirements

### Requirement: Run-mode HUD and step interaction
When the active prototype enables run mode, the playtest app SHALL display current/max HP, the run inventory, the stash summary, the attempt count, and run status messaging.

#### Scenario: HUD reflects run state
- **WHEN** the run status or bump message changes
- **THEN** the HUD updates to show HP, run inventory, stash, and any path-over reason

### Requirement: Win/lose banner and retry
When a run ends as won or lost, the app SHALL show a win or lose banner (including the path-over reason when present) and offer a try-again control that soft resets the run while preserving the revealed map and stash. After a win, banked gear SHALL remain visible in the stash.

#### Scenario: Retry after losing
- **WHEN** a run is lost and the player selects try again
- **THEN** the hero returns to start with the map still revealed, a new attempt begins with empty run inventory, and items that were on the person for the failed run are not restored

### Requirement: Revealed tile effect icons
Revealed tiles SHALL display an indicator of their effect (enemy, trap, powerup, wall, goal, mage, extraction) so the player can learn the map, and resolved enemy/powerup tiles SHALL be shown as cleared. Corner extraction tiles SHALL show their extraction indicator while face up.

#### Scenario: Defeated enemy shown as cleared
- **WHEN** an enemy has been defeated on a cell
- **THEN** that cell is rendered as a cleared enemy tile

#### Scenario: Corner extraction visible
- **WHEN** the board loads with face-up corner extraction tiles
- **THEN** those corners show an extraction indicator

### Requirement: Side inventory panel
When run mode is enabled, the playtest app SHALL show a side panel for the hero’s current run inventory (or an empty state) and SHALL update when items are granted, consumed, or banked.

#### Scenario: Empty inventory on new map
- **WHEN** a new Goblin Woods map starts
- **THEN** the side run inventory shows that no gear is held yet

#### Scenario: Inventory updates after consume
- **WHEN** the hero uses a pass item successfully
- **THEN** that item no longer appears in the run inventory panel
