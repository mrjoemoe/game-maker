## MODIFIED Requirements

### Requirement: Timeline playtest canvas
When the active prototype enables timeline mode, the Play tab SHALL render a branching timeline with **epoch at the bottom** and later nodes stacked **upward** on separate branch columns, plus a **1–20 row ruler** for path depth. The traveler token SHALL appear on the current node. Timeline nodes SHALL be compact (about half the previous card height). Hovering a timeline node SHALL show the cumulative culture, science, and politics on the path from epoch to that node.

#### Scenario: Seeded timeline is visible
- **WHEN** Timeline Game loads on the Play tab
- **THEN** the epoch node sits at the bottom with a primary branch mat, at least one event node stacked above it, and row numbers 1–20 along the time axis

#### Scenario: Hover shows society at that moment
- **WHEN** the player hovers a timeline card
- **THEN** the UI shows culture, science, and politics totaled along the path to that card

### Requirement: Player mat and debug device dock
The Play tab SHALL show a player mat (parts, minerals, crystals, up to 3 device slots, blueprints, objectives). In debug mode it SHALL provide always-available Device A–H controls with targeting instructions, plus debug draws and the ability to add any catalog card to hand. Hand cards SHALL use the same type coloring as timeline cards (not an unmarked white face).

#### Scenario: Branch from the dock
- **WHEN** the player activates Brancher and then a timeline node
- **THEN** a new branch column and branch mat appear from that node

#### Scenario: Debug draw into hand
- **WHEN** the player uses debug draw-action
- **THEN** a card appears in the hand panel with a visible type color and label
