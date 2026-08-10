## Purpose

Add run-mode presentation to the playtest web app.

## ADDED Requirements

### Requirement: Run-mode HUD and step interaction
When the active prototype enables run mode, the playtest app SHALL let the player move the hero one orthogonal step at a time by clicking an adjacent cell or using arrow keys, and SHALL display current/max HP, the item inventory, and the attempt count.

#### Scenario: Step by clicking a neighbor
- **WHEN** the player clicks a cell orthogonally adjacent to the hero
- **THEN** the app dispatches a step toward that cell

#### Scenario: HUD reflects run state
- **WHEN** the hero takes damage or collects an item
- **THEN** the HUD updates the HP display and inventory

### Requirement: Win/lose banner and retry
When a run ends, the app SHALL show a win or lose banner and offer a try-again control that soft resets the run while preserving the revealed map.

#### Scenario: Retry after losing
- **WHEN** a run is lost and the player selects try again
- **THEN** the hero returns to start with the map still revealed and a new attempt begins

### Requirement: Revealed tile effect icons
Revealed tiles SHALL display an indicator of their effect (enemy, trap, powerup, wall, goal) so the player can learn the map, and resolved enemy/powerup tiles SHALL be shown as cleared.

#### Scenario: Defeated enemy shown as cleared
- **WHEN** an enemy has been defeated on a cell
- **THEN** that cell is rendered as a cleared enemy tile
