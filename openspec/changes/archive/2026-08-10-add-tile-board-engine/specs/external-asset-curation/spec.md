## Purpose

Defines how third-party references and agent skills are curated under `external/` with provenance, so prior art is browsable without becoming an opaque vendor dump.

## ADDED Requirements

### Requirement: External policy and provenance files
The repository SHALL include `external/README.md`, `external/manifest.yaml`, and `external/APPROVED.md` documenting policy, machine-readable pins, and human review status.

#### Scenario: Policy files present
- **WHEN** a reviewer inspects `external/`
- **THEN** README, manifest, and APPROVED files exist and describe how assets are approved

### Requirement: Pinned puzzle skill import
The repository SHALL import the Apache-2.0 `puzzle` skill from `gamedev-skills/awesome-gamedev-agent-skills` as pinned files under `external/skills/`, recorded in the manifest with source URL, revision, license, and content digests.

#### Scenario: Puzzle skill recorded
- **WHEN** a reviewer reads `external/manifest.yaml`
- **THEN** an asset entry exists for the puzzle skill with revision and license Apache-2.0

### Requirement: Pending license candidates recorded
The repository SHALL list `tilemap-data-format` and `develop-web-game` as pending-license candidates in APPROVED documentation without treating them as approved imports until licenses are confirmed.

#### Scenario: Candidates not approved
- **WHEN** a reviewer reads the APPROVED summary
- **THEN** those two skills appear as candidates or pending, not as approved imports

### Requirement: Read-only reference submodules
The repository SHALL add git submodules under `external/references/` for boardgame.io, headless-game-grid, tile-whitebox-editor, and tiled, recorded in the manifest. Submodule contents MUST NOT be imported as runtime dependencies of `packages/*`. GPL and unverified-license references MUST be flagged as read-only browse material.

#### Scenario: Submodules present for browsing
- **WHEN** a developer lists `external/references/`
- **THEN** the four named reference directories exist as git submodules

#### Scenario: Engine does not depend on reference trees
- **WHEN** package dependencies for `packages/engine` and `packages/web` are inspected
- **THEN** none of the reference submodule paths are required runtime dependencies
