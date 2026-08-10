## Decisions

1. Rulebook lives at `prototypes/<id>/RULEBOOK.md` (player-facing prose, not OpenSpec).
2. Extensions may export `rulebook?: string` (markdown loaded with Vite `?raw`).
3. Playtest shows tabs when a rulebook is present; Play is the board/session, Rulebook is read-only docs.
4. Agents must update RULEBOOK.md in the same OpenSpec change that alters gameplay rules for that prototype.
