## Why

Recent minor Goblin Woods / engine / UI follow-ups were implemented as raw code without OpenSpec. Agents need a hard rule: every behavior change goes through OpenSpec, with a fast-track for small work that still archives into main specs and ends in commit + push.

## What Changes

- Strengthen `AGENT.md` and `openspec/config.yaml` so OpenSpec is mandatory for all behavior changes.
- Add `.cursor/skills/openspec-fasttrack/` for minor changes: slim change → implement → archive → commit+push.
- Extend `agent-operating-rules` with requirements for mandatory OpenSpec and the fast-track skill.

## Impact

- Agent workflow only (docs/skills/specs). No runtime game behavior change.
