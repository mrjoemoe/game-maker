---
name: openspec-fasttrack
description: >-
  DEFAULT OpenSpec workflow in game-maker for clear behavior changes: slim
  proposal/specs/tasks, implement immediately, archive into main specs, then
  commit and push. Use whenever the user describes a feature, rule, inventory,
  map, UI, or bugfix to build — including multi-capability engine+web+prototype
  work. Prefer this over openspec-propose unless the user asks to plan-only or
  the request is too ambiguous to implement.
---

# OpenSpec fast-track (default for clear changes)

## When to use

**This is the default** for behavior work in `game-maker`. Use it when the user describes what they want with clear enough acceptance criteria, for example:

- Game rule / inventory / extraction / loadout / win-condition changes
- Engine + playtest UI + prototype config in one request
- Path programming, walls, tile visuals, HUD, tallies
- Focused bugfixes with clear expected behavior
- Phrases like “make an update”, “here’s the idea”, “let’s make…”, “can you also…”

**Do not** route those to `openspec-propose` (plan artifacts only, then stop). Fast-track writes slim OpenSpec artifacts **and continues into implementation** in the same effort.

Use full **openspec-propose** only when:

- The user explicitly asks to propose / plan first / `/opsx-propose`, or
- Material ambiguity blocks coding and needs a design review gate before any implementation

Spanning multiple capabilities or feeling “medium-large” is **not** enough to skip fast-track.

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

If the change alters gameplay rules for a prototype that has `RULEBOOK.md`, update that rulebook in the same change (see `AGENT.md`).

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

- Using full `openspec-propose` and stopping for review when the user already gave clear build criteria
- Implementing a Goblin Woods / engine / web tweak with no OpenSpec change
- Leaving an active change unarchived after shipping code
- Archiving without syncing main specs
- Committing without pushing after archive (unless user said not to push)
