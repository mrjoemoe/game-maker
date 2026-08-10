## MODIFIED Requirements

### Requirement: Soft reset preserves learned map and items
The engine SHALL provide a soft reset action that returns the hero to the start position, restores HP to max, seeds the inventory from discovered items, increments the attempt count, and clears enemy resolved flags, while preserving revealed tile faces and discovered items. A full reset action SHALL clear discoveries and rebuild the board; when run mode is enabled and the board uses generated side walls, full reset SHALL re-roll the side-wall seed so the new map’s wall layout can differ.

#### Scenario: Retry after defeat keeps the map
- **WHEN** a run ends lost and a soft reset is applied
- **THEN** the hero returns to start with full HP, previously revealed tiles stay face up, and items discovered in prior attempts are in the inventory

#### Scenario: Full reset clears discoveries
- **WHEN** a full reset action is applied
- **THEN** tile faces, hero position, run state, and discovered items all return to the initial definition

#### Scenario: Full reset rerolls side walls in run mode
- **WHEN** a run-mode game with generated side walls is fully reset
- **THEN** the new board is built with a new side-wall seed (not necessarily the previous seed)
