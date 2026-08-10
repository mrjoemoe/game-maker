## Why

Players and agents need a living rulebook for Goblin Woods as rules keep changing. The playtest UI should expose it, and AGENT.md should require updating it whenever gameplay rules change.

## What Changes

- Add `prototypes/<id>/RULEBOOK.md` (Goblin Woods first) and expose it via prototype extensions.
- Playtest UI: Play / Rulebook tabs; Rulebook renders the prototype rulebook.
- AGENT.md (+ agent-operating-rules): when rules change, update the active prototype’s RULEBOOK.md in the same change.

## Impact

- `playtest-web-app`: tabbed play/rulebook
- `template-prototype-model`: rulebook file convention
- `agent-operating-rules` / `AGENT.md`: keep rulebook current
