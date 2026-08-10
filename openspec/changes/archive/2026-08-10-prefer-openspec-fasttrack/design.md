## Context

Skill descriptions drive auto-selection. `openspec-propose` said “user wants to quickly describe what they want to build,” which matches normal feature chat and incorrectly selects plan-only propose.

## Decisions

1. **Default = fast-track** for clear gameplay/UI/engine/prototype requests, including multi-capability work with known acceptance criteria.
2. **Full propose** only when the user asks for propose/plan-first (`/opsx-propose`), or the request is too ambiguous to implement without a separate design review gate.
3. Touch `AGENT.md`, both skills’ frontmatter + body, `openspec/config.yaml`, and `agent-operating-rules` spec.

## Open Questions

None.
