## Context

See proposal.md. Builds on the layered engine (`grid` → `tiles` → `board` → `pieces` → `game`) and the template/prototype model. Run mode is an opt-in capability so existing prototypes (`meadow-v1`, `quiet-glade`) are unaffected.

## Goals / Non-Goals

**Goals:**
- Reusable, config-driven run-based exploration on the tile-board template.
- Die-and-retry loop that preserves the revealed map and found items across attempts.
- Simple, deterministic combat/trap/powerup/goal resolution in the headless engine.

**Non-Goals:**
- Procedural map generation (v1 maps are hand-authored via overrides).
- Multi-hero parties, turn order, or enemy movement.
- A pre-run loadout picker UI (found items auto-carry into the next attempt).

## Decisions

### 1. Tile effects live on the tile type
- `TileTypeDefinition.effect?: TileEffect` where each distinct effect is its own tile type (e.g. `goblin`, `pit`, `sword`, `castle`). Keeps the effect data static/config-driven and reuses the existing registry.
- Per-cell mutable state stays on `TileState` via a new `resolved?: boolean` so a defeated goblin / collected power-up on one cell does not re-trigger, without mutating the shared type.

### 2. Run state on GameState
- `GameState.run: RunState` = `{ status: "playing" | "won" | "lost"; hp; maxHp; inventory: string[]; attempts }`.
- `GameState.discoveredItemIds: string[]` persists across `softReset` so gear found in a failed run is available next attempt. `reset` (full wipe) clears it.
- Non-run prototypes still get a `run` object (derived from defaults) but never use it; UI only surfaces it when `features.runMode` is on.

### 3. Actions
- `step`: validates the destination is an in-bounds orthogonal neighbor of the hero. `wall` reveals the tile and rejects the move; every other tile reveals, moves the hero, and resolves its effect. No-op when `status !== "playing"`.
- `softReset`: hero → `startPosition`, `hp → maxHp`, `inventory` seeded from `discoveredItemIds`, `attempts += 1`, enemy `resolved` flags cleared (goblins respawn) while the revealed map, traps, walls, and goal knowledge persist.
- `reset`: unchanged full rebuild from the definition.

### 4. Combat / resolution rule
- Attack = `baseAttack + Σ item.attackBonus` over inventory. Max HP = `run.maxHp` base + `Σ item.maxHpBonus`.
- `enemy`: attack ≥ `power` ⇒ defeated (`resolved`, grant `rewardItemId` if any); else `hp -= damage`.
- `trap`: `hp -= damage` (repeatable — a known trap still hurts if re-entered).
- `powerup`: add `itemId` to inventory + `discoveredItemIds`, mark `resolved`.
- `goal`: `status = "won"`. `hp <= 0` ⇒ `status = "lost"`.

### 5. Web run mode
- When `runMode` is on: clicking an orthogonal neighbor dispatches `step`; arrow keys also step; a `RunHud` shows HP bar, item chips, attempts, and a win/lose banner with "Try again" (soft reset). Free move/flip toolbar is hidden.

## Risks / Trade-offs

- [Effect on type vs cell] Distinct stats need distinct tile types → acceptable; keeps engine simple and config declarative.
- [Balance] Hand-tuned numbers may make the first blind run winnable or the retry too hard → tune in the `goblin-woods` config, not the engine.

## Migration Plan

Additive only. Existing prototypes keep working because `runMode` defaults off and new fields are optional.

## Open Questions

None blocking.
