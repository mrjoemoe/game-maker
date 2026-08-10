## ADDED Requirements

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

## MODIFIED Requirements

### Requirement: Fast-track skill for minor changes
The repository SHALL include a Cursor skill that documents fast-track as the **default** OpenSpec path for clear behavior changes (not only trivial one-liners): slim OpenSpec artifacts, implement, archive (sync into main specs), then commit and push per archive-and-push. The skill description SHALL match ordinary “build this feature” requests so agents select it over plan-only propose.

#### Scenario: Fast-track skill present
- **WHEN** an agent handles a clear behavior change
- **THEN** the openspec-fasttrack skill is available describing slim change → implement → archive → commit+push as the default path
