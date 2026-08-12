# agent-operating-rules Specification

## Purpose

Encodes lasting agent guidance so AI assistants compose games from the component library and finalize archives by committing and pushing to remote.

## Requirements

### Requirement: Root AGENT.md operating model
The repository SHALL include a root `AGENT.md` that states the component-library and variant operating model: reusable game parts live in canonical libraries, playable games are variant composition manifests, shared engine/web packages remain common runtime, copied component definitions are forbidden, and explicit variant-local overrides are permitted only when they are intentionally not shared.

#### Scenario: AGENT.md present
- **WHEN** an agent starts work in this repository
- **THEN** `AGENT.md` explains how to choose between changing a canonical component, changing variant composition, and adding a variant-only extension

### Requirement: Prototype-from-template skill
The repository SHALL replace or redirect the template-first prototype skill with a variant-authoring skill that instructs agents to create game versions by composing canonical components. The skill MUST require searching the library before creating a component and MUST forbid copying a complete prototype definition.

#### Scenario: Skill documents variant scaffold steps
- **WHEN** an agent needs to add a new game version
- **THEN** the skill describes selecting components, authoring a composition manifest, adding only missing reusable components, registering the variant, and validating the resolved result

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
The repository SHALL include a Cursor skill that documents fast-track as the default OpenSpec path for clear behavior changes: classify scope as canonical-component, variant-composition, or variant-local; create slim artifacts; update component manifests and documentation when applicable; implement; validate all affected variants; archive; then commit and push. The skill description SHALL match ordinary game-development requests so agents select it over plan-only propose.

#### Scenario: Fast-track skill present
- **WHEN** an agent handles a clear behavior change
- **THEN** the fast-track workflow includes component impact analysis and affected-variant verification before archive

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

### Requirement: Agents classify component scope before editing
Before implementing a game-part change, agents SHALL determine whether the requested behavior is shared, reusable but new, a composition difference, or truly variant-only. The chosen scope and rationale MUST be recorded in the OpenSpec change.

#### Scenario: Existing shared piece changes
- **WHEN** a request changes behavior owned by a canonical piece component
- **THEN** the agent updates that component and does not duplicate the change in each consuming variant

#### Scenario: Experimental rule differs in one variant
- **WHEN** a request explicitly limits an experimental rule to one variant
- **THEN** the agent records a variant-local composition override or extension without changing unrelated variants

### Requirement: Skills maintain library records during development
The apply and fast-track skills SHALL require component source, manifests, dependency declarations, contract versions, lifecycle state, documentation, examples, and tests to be updated together whenever a component's public behavior changes.

#### Scenario: Component gains a dependency
- **WHEN** implementation makes one component depend on another
- **THEN** the same change updates the declared dependency graph and relevant component documentation

#### Scenario: Public contract changes
- **WHEN** implementation changes a component's public contract incompatibly
- **THEN** the workflow requires a major contract version and migration guidance before completion

### Requirement: Skills validate every affected variant
The apply, fast-track, and archive workflows SHALL run component impact analysis and SHALL block completion when any direct or transitive consuming variant fails resolution, validation, type-checking, or relevant tests.

#### Scenario: Shared component has three consumers
- **WHEN** an agent changes that component
- **THEN** the workflow validates all three variants before marking the OpenSpec tasks complete

### Requirement: Planning skills consult the component catalog
OpenSpec propose and fast-track planning SHALL inspect the component catalog and dependency graph before proposing new game parts, and artifact templates SHALL identify components created, reused, changed, pinned, deprecated, or migrated.

#### Scenario: Requested part already exists
- **WHEN** a requested game part is compatible with an existing component
- **THEN** the plan references that component instead of proposing a duplicate

### Requirement: Rulebook updates trace to component changes
When a shared component changes player-facing gameplay, agents SHALL update the component's canonical player-facing documentation and every affected variant rulebook section that composes or overrides that documentation.

#### Scenario: Shared combat rule changes
- **WHEN** a canonical combat component changes player-facing rules
- **THEN** its documentation and affected generated or maintained variant rulebooks are updated in the same change
