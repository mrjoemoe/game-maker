# Approved external sources

Machine-readable pins live in [`manifest.yaml`](manifest.yaml).

## Approved imports

| ID | Source | Revision | License | Review date | Reviewer | Files |
|---|---|---|---|---|---|---|
| gamedev-skills-puzzle | https://github.com/gamedev-skills/awesome-gamedev-agent-skills | `3727d02499efac5d4703ccdc5e59e54e60e954b7` | Apache-2.0 | 2026-08-10 | jordan-morris | `external/skills/gamedev-skills/puzzle/SKILL.md`, `external/skills/gamedev-skills/LICENSE` |

## Reference submodules (browse only)

| ID | Path | License | Copy into packages? |
|---|---|---|---|
| ref-boardgame-io | `external/references/boardgame.io` | MIT | No (reference only) |
| ref-headless-game-grid | `external/references/headless-game-grid` | MIT | No (reference only) |
| ref-tile-whitebox-editor | `external/references/tile-whitebox-editor` | UNVERIFIED | **Forbidden** until license confirmed |
| ref-tiled | `external/references/tiled` | GPL-2.0-or-later | **Forbidden** (GPL) |

Submodule commit SHAs are recorded by git (`.gitmodules` + submodule HEADs) after `git submodule add`.

## Candidates pending license confirmation (not approved)

| Source | URL | Status | Notes |
|---|---|---|---|
| tilemap-data-format skill | https://github.com/0xheycat/isometric-game-skills | pending license | Layered JSON tilemap guidance; do not import until LICENSE verified |
| develop-web-game skill | https://github.com/openai/skills/tree/main/skills/.curated/develop-web-game | pending license | Playwright play/test loop; confirm repo license before pinning |

## Update procedure

1. Re-fetch upstream revision; re-read every imported file.
2. Update `manifest.yaml` revision + sha256 (skills) or submodule pin.
3. Update this table.
4. Merge only after re-review.
