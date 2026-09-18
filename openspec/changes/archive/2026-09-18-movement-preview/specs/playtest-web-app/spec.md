## ADDED Requirements

### Requirement: Walk preview and step motion
When run mode is enabled, the playtest board SHALL highlight cells on the currently queued walk. Hovering a reachable destination SHALL preview the walk that a click would append. While a program is executing, the hero token SHALL play a short motion cue and face the direction of the step being applied.

#### Scenario: Queued walk is marked
- **WHEN** the player has queued two north moves
- **THEN** the two cells north of the hero show a path highlight

#### Scenario: Hover previews the next walk
- **WHEN** the track is empty and the pointer hovers an open cell two steps away
- **THEN** those two cells show a hover preview highlight

#### Scenario: Token pulses on a step
- **WHEN** Run executes a move action
- **THEN** the hero token on the destination cell shows a motion cue
