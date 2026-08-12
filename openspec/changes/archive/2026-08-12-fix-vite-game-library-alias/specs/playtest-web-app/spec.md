## ADDED Requirements

### Requirement: Vite resolves game-library
The playtest Vite config SHALL alias `@game-maker/game-library` to the package TypeScript entry so composed prototype configs and the registry resolve during development and Docker launches.

#### Scenario: Goblin Woods loads in Vite
- **WHEN** the playtest app imports a prototype that depends on `@game-maker/game-library`
- **THEN** Vite resolves the import without a missing-module error
