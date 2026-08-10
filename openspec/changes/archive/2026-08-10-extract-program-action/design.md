## Decisions

1. Extract mirrors Mage take: stand on extraction, program `extract`, run ends before the paired move.
2. Paired move is still required by `ProgramStep` shape but is a no-op after successful extract.
3. Planner treats any queued `extract` step as terminal — no append after it.

## Open Questions

None.
