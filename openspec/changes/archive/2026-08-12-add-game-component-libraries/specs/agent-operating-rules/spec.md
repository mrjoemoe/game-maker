## MODIFIED Requirements

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

### Requirement: Fast-track skill for minor changes
The repository SHALL include a Cursor skill that documents fast-track as the default OpenSpec path for clear behavior changes: classify scope as canonical-component, variant-composition, or variant-local; create slim artifacts; update component manifests and documentation when applicable; implement; validate all affected variants; archive; then commit and push. The skill description SHALL match ordinary game-development requests so agents select it over plan-only propose.

#### Scenario: Fast-track skill present
- **WHEN** an agent handles a clear behavior change
- **THEN** the fast-track workflow includes component impact analysis and affected-variant verification before archive

## ADDED Requirements

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
