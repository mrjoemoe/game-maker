## ADDED Requirements

### Requirement: Click destination queues a walk
When run mode is enabled and the run is still playing, activating a destination cell SHALL append the shortest orthogonal walk from the hero’s projected chart position to that cell as move actions on the action track, up to the remaining program slots. The walk SHALL respect edge walls and face-up solid-wall tiles. Activating the projected cell, an unreachable cell, or a cell while the chart is locked (executing, full, or ended with Extract) SHALL NOT append actions. Directional bank buttons SHALL remain available.

#### Scenario: Click queues two moves
- **WHEN** the hero is at (3,6), the track is empty, and the player activates an open cell two orthogonal steps away with no wall in between
- **THEN** the track gains those two move actions in order

#### Scenario: Click continues from the planned end
- **WHEN** the track already has a move that would place the hero one cell north
- **AND** the player activates the cell two north of the live hero
- **THEN** the appended walk starts from the projected cell, not the live piece

#### Scenario: Walls are not queued
- **WHEN** the only orthogonal step to the clicked cell crosses an edge wall
- **THEN** that click does not append a move through the wall

#### Scenario: Bank still works
- **WHEN** the player clicks Right in the action bank
- **THEN** a move-right action is still appended as before
