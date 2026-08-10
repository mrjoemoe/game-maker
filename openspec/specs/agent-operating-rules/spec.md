# agent-operating-rules Specification

## Purpose

Encodes lasting agent guidance so AI assistants create games as prototypes from templates and finalize archives by committing and pushing to remote.

## Requirements

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

### Requirement: OpenSpec required for behavior changes
Agents SHALL create an OpenSpec change before implementing behavior or product changes (including minor UI, rule, and prototype config tweaks). Coding those changes without an OpenSpec change is forbidden unless the user explicitly waives OpenSpec in the same request.

#### Scenario: Minor follow-up still needs OpenSpec
- **WHEN** a user asks for a small gameplay or UI tweak
- **THEN** the agent creates or uses an OpenSpec change before editing runtime code

### Requirement: Fast-track skill for minor changes
The repository SHALL include a Cursor skill that documents a fast-track path for minor changes: slim OpenSpec artifacts, implement, archive (sync into main specs), then commit and push per archive-and-push.

#### Scenario: Fast-track skill present
- **WHEN** an agent handles a minor clear change
- **THEN** the openspec-fasttrack skill is available describing propose → implement → archive → commit+push
