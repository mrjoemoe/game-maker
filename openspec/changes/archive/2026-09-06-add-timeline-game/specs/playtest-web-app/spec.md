## ADDED Requirements

### Requirement: Timeline playtest canvas
When the active prototype enables timeline mode, the Play tab SHALL render a branching timeline (epoch on the left, later nodes to the right, forked branches on separate lanes with branch mats) instead of the tile-board run UI. The traveler token SHALL appear on the current node.

#### Scenario: Seeded timeline is visible
- **WHEN** Timeline Game loads on the Play tab
- **THEN** the epoch node, a primary branch mat, and at least one forward event node are visible with the traveler on epoch

### Requirement: Play and Rulebook tabs for Timeline Game
Timeline Game SHALL offer Play and Rulebook tabs. Rulebook SHALL show the variant `RULEBOOK.md`.

#### Scenario: Open Timeline Game rulebook
- **WHEN** the player selects the Rulebook tab
- **THEN** the Timeline Game rules markdown is shown instead of the timeline canvas

### Requirement: Player mat and debug device dock
The Play tab SHALL show a player mat (parts, minerals, crystals, up to 3 device slots, blueprints, objectives). In debug mode it SHALL provide always-available Device A–H controls with targeting instructions, plus debug draws and the ability to add any catalog card to hand.

#### Scenario: Branch from the dock
- **WHEN** the player activates Brancher and then a timeline node
- **THEN** a new branch lane and branch mat appear from that node

#### Scenario: Debug draw into hand
- **WHEN** the player uses debug draw-action
- **THEN** a card appears in the hand panel

### Requirement: Click-to-move in debug
In timeline debug mode, activating a node SHALL move the traveler there so the designer can walk through time without turn-rule checks.

#### Scenario: Click a future node
- **WHEN** debug is on and the player activates a node ahead of the traveler
- **THEN** the traveler token is shown on that node
