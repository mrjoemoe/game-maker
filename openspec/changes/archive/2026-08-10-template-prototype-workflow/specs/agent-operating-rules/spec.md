## Purpose

Encodes lasting agent guidance so AI assistants create games as prototypes from templates and finalize archives by committing and pushing to remote.

## ADDED Requirements

### Requirement: Root AGENT.md operating model
The repository SHALL include a root `AGENT.md` that states templates vs prototypes rules: new games are prototypes under `prototypes/`, templates under `templates/` stay shared source, and configs drive naming and features.

#### Scenario: AGENT.md present
- **WHEN** an agent starts work in this repository
- **THEN** `AGENT.md` is available describing the template/prototype operating model

### Requirement: Prototype-from-template skill
The repository SHALL include a Cursor skill that instructs agents to scaffold new games as prototypes from an existing template rather than duplicating template source.

#### Scenario: Skill documents scaffold steps
- **WHEN** an agent needs to add a new game version
- **THEN** the skill describes creating `prototypes/<id>/` with config (and optional extensions) bound to a template id

### Requirement: Archive then commit and push skill
The repository SHALL include a Cursor skill requiring that after archiving an OpenSpec change, the agent also creates a git commit of the resulting work and pushes it to the remote, unless the user explicitly forbids pushing.

#### Scenario: Archive implies commit and push
- **WHEN** an agent archives a completed OpenSpec change and the user has not forbidden pushing
- **THEN** the agent commits the relevant changes and pushes to the configured remote
