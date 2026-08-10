---
name: archive-and-push
description: After archiving an OpenSpec change, create a git commit and push to remote. Use whenever an OpenSpec change is archived, or when the user asks to archive a change.
---

# Archive then commit and push

## Rule

Whenever you **archive** an OpenSpec change in this repository, you MUST also:

1. Stage the relevant project changes (archived OpenSpec artifacts, synced specs, implementation).
2. Create a git commit with a concise message focused on why.
3. **Push** the commit to the configured remote (`origin`), unless the user explicitly says not to push.

This overrides a default “don’t push unless asked” habit **for archive completions in this repo**.

## Steps

1. Complete the normal OpenSpec archive workflow (sync main specs when applicable, move change to `openspec/changes/archive/`).
2. Run `git status`, `git diff`, and `git log -5 --oneline` in parallel.
3. Stage relevant files (never secrets). Include `.gitmodules` / submodule pointers if changed.
4. Commit with a HEREDOC message.
5. `git push -u origin HEAD` (or push the current branch to its upstream).
6. Report the archive path, commit hash, and remote result.

## Exceptions

- User says “archive only”, “don’t commit”, or “don’t push” in the same request → follow that exception.
- Push fails (auth/network) → report the error; leave the local commit intact.
