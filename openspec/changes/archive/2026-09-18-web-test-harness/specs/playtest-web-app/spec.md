## ADDED Requirements

### Requirement: Playtest web tests in npm test
The playtest web package SHALL have an automated test script, and the repository root `npm test` command SHALL run those tests in addition to engine and game-library tests. The suite SHALL cover run-mode click-to-queue walks, debug cell inspection text, sandbox cell click actions, and playtest route helpers.

#### Scenario: Root test runs web tests
- **WHEN** a developer runs `npm test` from the repository root
- **THEN** the playtest web package tests execute

#### Scenario: Click-to-queue is covered
- **WHEN** the web tests run
- **THEN** they assert that a destination click helper queues orthogonal moves around a wall
