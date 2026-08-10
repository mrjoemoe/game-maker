## ADDED Requirements

### Requirement: Keep prototype rulebook current
Whenever an OpenSpec change alters gameplay rules for a prototype that has a `RULEBOOK.md`, agents SHALL update that rulebook in the same change so it matches the shipped behavior. `AGENT.md` SHALL state this duty.

#### Scenario: Rule change updates rulebook
- **WHEN** an agent implements a Goblin Woods rule change
- **THEN** `prototypes/goblin-woods/RULEBOOK.md` is updated to reflect the new rules before archive/commit
