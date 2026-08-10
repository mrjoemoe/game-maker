## Why

Agents default to full `openspec-propose` (plan-only, stop for review) when the user describes a clear game feature. In this repo the default must be **fast-track**: slim OpenSpec → implement → archive → commit+push.

## What Changes

- `AGENT.md`: fast-track is the **default**; full propose only for explicit plan-only / high ambiguity.
- `openspec-fasttrack` skill: broaden “when to use” and skill description so feature requests match it.
- `openspec-propose` skill: narrow description so it does not steal clear build requests.
- `openspec/config.yaml` + `agent-operating-rules`: same default.

## Impact

- Agent routing for OpenSpec workflows
- No runtime game code
