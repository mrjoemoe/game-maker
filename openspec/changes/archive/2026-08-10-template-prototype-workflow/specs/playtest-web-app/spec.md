## Purpose

Playtest UI loads a selected prototype configuration and respects prototype feature flags while presenting the prototype's display name.

## ADDED Requirements

### Requirement: Load prototype by launch selection
The playtest web app SHALL load the game definition from the prototype selected at launch (environment/config), not from a hard-coded single template package import.

#### Scenario: Launch meadow prototype
- **WHEN** the playtest app is started with prototype id `meadow-v1`
- **THEN** it renders the board and name from `prototypes/meadow-v1`

### Requirement: Honor flip feature flag in UI
When tile flipping is disabled for the active prototype, the playtest UI SHALL NOT offer flip mode (or SHALL no-op flip interactions).

#### Scenario: Flip UI hidden when disabled
- **WHEN** the active prototype disables tile flip
- **THEN** the Flip tiles control is not available as an active flip mode
