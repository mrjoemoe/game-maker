## ADDED Requirements

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
