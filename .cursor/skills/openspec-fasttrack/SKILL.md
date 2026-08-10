---
name: openspec-fasttrack
description: Fast-track a minor change through OpenSpec (slim proposal/specs/tasks), implement it, archive into main specs, then commit and push. Use for small feature tweaks, rule changes, UI additions, or bugfixes in this repo — never skip OpenSpec by coding first.
---

# OpenSpec fast-track (minor changes)

## When to use

Use this skill for **minor** work in `game-maker`, for example:

- Game rule tweaks (e.g. path-over-on-hazard, program length)
- Small UI additions (path planner, tile tally, wall visuals, bump messages)
- Prototype config adjustments that change behavior
- Focused engine/UI bugfixes with clear acceptance criteria

**Do not** skip OpenSpec and implement code first. Phrases like “can you also…”, “make it so…”, or “fix …” still require this workflow.

Use the full propose → apply → archive flow (not this fast-track) when the change is large, architectural, or spans many capabilities with unclear trade-offs.

## Hard rule

Every behavior change MUST:

1. Create/update an OpenSpec change under `openspec/changes/<name>/`
2. Implement against that change’s tasks
3. **Archive** (sync delta specs into `openspec/specs/`, move change to `openspec/changes/archive/YYYY-MM-DD-<name>/`)
4. **Commit and push** per `.cursor/skills/archive-and-push/SKILL.md`

Exceptions only if the user explicitly says skip OpenSpec, archive-only, don’t commit, or don’t push.

## Fast-track steps

### 1. Slim OpenSpec change (before coding)

Create `openspec/changes/<kebab-name>/` with:

| Artifact | Fast-track expectation |
|----------|----------------------|
| `.openspec.yaml` | `schema: spec-driven` + `created: YYYY-MM-DD` |
| `proposal.md` | Short Why / What Changes / Impact (a few bullets) |
| `design.md` | Brief decisions only (or “None beyond proposal” if truly trivial) |
| `specs/<capability>/spec.md` | ADDED/MODIFIED requirements + scenarios for the behavior change |
| `tasks.md` | Checklist of implementation steps |

Validate: `npx openspec validate <name> --strict`

Typical capability targets: `board-engine-core`, `playtest-web-app`, `template-prototype-model`.

### 2. Implement

Apply tasks; keep scope to the change. Run `npm run test` / `npm run typecheck` (and playtest if UI-facing).

Mark tasks `[x]` in `tasks.md` when done.

### 3. Archive + sync specs

- Merge delta requirements into matching `openspec/specs/<capability>/spec.md`
- Move change dir to `openspec/changes/archive/YYYY-MM-DD-<name>/`
- Follow `.cursor/skills/openspec-archive-change/SKILL.md` when using the full archive command flow

### 4. Commit and push

Follow `.cursor/skills/archive-and-push/SKILL.md`:

- Stage implementation + archived change + synced specs
- Commit with a why-focused message
- `git push` to `origin` unless the user forbade push
- Report archive path, commit hash, and push result

## Anti-patterns

- Implementing a “quick” Goblin Woods / engine / web tweak with no OpenSpec change
- Leaving an active change unarchived after shipping code
- Archiving without syncing main specs
- Committing without pushing after archive (unless user said not to push)
