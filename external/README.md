# External assets policy

`external/` is a curated import area with pin, license, and review discipline.
It is **not** a place to merge third-party code into `packages/*`.

## Layout

| Path | Purpose |
|------|---------|
| `skills/` | Pinned agent skill files (SKILL.md + LICENSE) |
| `references/` | Git submodules for **browsing** prior art only |

## No application vendoring into packages

Reference submodules under `external/references/` MUST NOT be runtime or build
dependencies of `packages/engine` or `packages/web`. Do not copy GPL or
unverified-license code into first-party packages.

## Required provenance fields

Every imported asset MUST be recorded in [`manifest.yaml`](manifest.yaml)
and summarized in [`APPROVED.md`](APPROVED.md) with source URL, immutable
revision, license, review date, reviewer, files/paths, and notes.

## Authority

Local OpenSpec / Cursor skills remain authoritative for planning and
implementing changes in this repository. Imported skills MUST NOT bypass
OpenSpec.
