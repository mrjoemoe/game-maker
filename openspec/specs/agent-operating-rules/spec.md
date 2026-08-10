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
The repository SHALL include a Cursor skill that documents fast-track as the **default** OpenSpec path for clear behavior changes (not only trivial one-liners): slim OpenSpec artifacts, implement, archive (sync into main specs), then commit and push per archive-and-push. The skill description SHALL match ordinary “build this feature” requests so agents select it over plan-only propose.

#### Scenario: Fast-track skill present
- **WHEN** an agent handles a clear behavior change
- **THEN** the openspec-fasttrack skill is available describing slim change → implement → archive → commit+push as the default path

### Requirement: Fast-track is the default OpenSpec workflow
Agents SHALL use the openspec-fasttrack skill as the default for behavior changes when the user describes what to build or fix with clear enough acceptance criteria—including multi-file engine, UI, and prototype updates. Agents SHALL NOT use the full openspec-propose plan-only workflow for those requests.

#### Scenario: Clear feature request uses fast-track
- **WHEN** a user describes a gameplay or inventory change with concrete rules and asks to make the update
- **THEN** the agent follows openspec-fasttrack (slim change → implement → archive → commit+push) rather than propose-and-stop

### Requirement: Full propose is opt-in or for ambiguity
Agents SHALL use full openspec-propose only when the user explicitly asks to propose or plan first, or when material ambiguity blocks implementation and needs a design review gate before coding.

#### Scenario: User asks to propose only
- **WHEN** a user asks to propose or plan a change without implementing yet
- **THEN** the agent may use openspec-propose and stop after artifacts

### Requirement: Keep prototype rulebook current
Whenever an OpenSpec change alters gameplay rules for a prototype that has a `RULEBOOK.md`, agents SHALL update that rulebook in the same change so it matches the shipped behavior. `AGENT.md` SHALL state this duty.

#### Scenario: Rule change updates rulebook
- **WHEN** an agent implements a Goblin Woods rule change
- **THEN** `prototypes/goblin-woods/RULEBOOK.md` is updated to reflect the new rules before archive/commit
