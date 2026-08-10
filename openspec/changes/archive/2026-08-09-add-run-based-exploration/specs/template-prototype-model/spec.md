## Purpose

Extend the template/prototype model so prototypes can opt into run-based exploration via config.

## ADDED Requirements

### Requirement: Config enables run mode
A prototype config SHALL be able to enable run mode and declare a run setup (hero piece, start position, max HP, base attack) plus optional items. When run mode is enabled, the playtest app SHALL present run-based interaction instead of free move/flip.

#### Scenario: Prototype enables run mode
- **WHEN** a prototype sets run mode enabled with a hero start position and max HP
- **THEN** the playtest app starts a run for that hero and shows run status

#### Scenario: Run mode is opt-in
- **WHEN** a prototype omits run mode
- **THEN** the prototype behaves as a normal flip/move tile-board game
