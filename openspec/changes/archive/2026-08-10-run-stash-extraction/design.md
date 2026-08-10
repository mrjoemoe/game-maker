## Context

Goblin Woods run mode today treats `discoveredItemIds` as permanent gear: Mage/powerup grants are seeded back into `run.inventory` on every soft reset. Pass items are checked on use but not consumed. The castle is a fixed override near the top center, and there is no way to bank gear mid-map without “winning.”

This change introduces a stash/loadout/extract loop while keeping the castle as the only win.

## Goals / Non-Goals

**Goals:**

- Persistent stash between attempts; run inventory only for the active attempt
- Loadout commitment removes items from stash (failure loses them)
- Consume-on-successful-use for `useItem`
- Four face-up corner extraction tiles that bank inventory and end as `extracted`
- Castle remains the win; win also banks remaining run inventory
- Goblin Woods: corners = extraction; castle placed randomly (not start/corners)

**Non-Goals:**

- Inventory stack counts / duplicate copies of the same item id (keep current unique-id list behavior)
- Limited loadout slot caps or weight
- Changing path length, side-wall generation, or pass-item matching rules beyond consume-on-use
- Replacing castle win with extraction win
- Multiplayer or cross-map stash persistence outside the session

## Decisions

### 1. Replace `discoveredItemIds` with `stashItemIds`

- **Choice:** Rename/repurpose the persistent list to `stashItemIds`. Run inventory is never auto-seeded from it.
- **Why:** Same persistence slot, clearer semantics; avoids two parallel “discovered” concepts.
- **Alternatives:** Keep `discoveredItemIds` as a discovery log plus separate stash — rejected as redundant for this prototype.

### 2. Explicit `commitLoadout` action

- **Choice:** Engine action `{ type: "commitLoadout"; itemIds: string[] }` valid when the run is playing (or after soft reset) with empty run inventory (or always replacing only when inventory empty). Selected ids must be a subset of stash; they move stash → inventory.
- **Why:** Keeps loadout in the engine (testable) rather than only in UI state.
- **Alternatives:** UI-only mutation of state — rejected; soft-reset seeding of a preselected loadout — weaker for empty starts and mid-session stash changes.

### 3. Run status `extracted`

- **Choice:** Add `"extracted"` alongside `playing` | `won` | `lost`. Soft reset works from extracted/won/lost the same way (map preserved, inventory cleared, stash kept).
- **Why:** UI can show a distinct banner; extraction is not a win.
- **Alternatives:** Treat extract as `won` with a flag — rejected (pollutes win). Auto soft-reset inside step — rejected (UI needs to show banking).

### 4. Banking merge

- **Choice:** On extract or goal win: `stashItemIds = unique(stash ∪ run.inventory)` after consuming the used pass item on the winning step (used item already removed, so it is not banked). Clear `run.inventory`.
- **Why:** Matches “only what you still hold comes out.”
- **Alternatives:** Multiset merge — out of scope.

### 5. Consume on successful use only

- **Choice:** Remove the item when `useItem` successfully applies (pass traverse, sledgehammer break). Invalid use that fails the run does not need to spend if the action never applied; if the item was required and held but the move still fails after spend, prefer spend-on-accept of the action then resolve move (implementation: spend when action validates and effect applies).
- **Why:** Matches “used knife is gone.”
- **Alternatives:** Durability charges — out of scope.

### 6. Extraction effect + Goblin Woods corners

- **Choice:** New tile effect `{ kind: "extraction" }`. Prototype overrides four corners to that type with `faceUp: true` (or engine forces face-up for extraction cells at create). Safe step like mage, then bank + `extracted`.
- **Why:** Config-driven; corners always known safe exits for banking.
- **Alternatives:** Special-case coordinates in engine — rejected.

### 7. Random castle placement

- **Choice:** At board build for Goblin Woods (definition factory or createGame hook), pick one random cell from eligible set: in-bounds, not start, not the four corners; place castle there. Full reset re-rolls. Remove fixed `{ x: 3, y: 0 }` override.
- **Why:** User asked for randomly located goal; keeps extraction corners stable.
- **Alternatives:** Weighted near top — optional later; not required now.
- **Seed:** Use board side-wall seed or a derived castle seed so maps are reproducible in tests when seed is fixed; tests can assert invariants without asserting a fixed castle coord.

### 8. Powerups / Mage

- **Choice:** Grants add to run inventory only (stop writing stash/discovered on grant). Mage resolved flags still persist across soft reset so the opening Mage is one-shot per map.
- **Why:** Gear must be extracted to keep it; Mage remains the opener for a fresh attempt’s pickup.

## Risks / Trade-offs

- [Planner projected inventory assumes non-consuming use] → Update projected inventory to remove used items across later slots in the same program.
- [Players soft-reset without extracting and lose progress] → Clear extracted banner + copy that banked gear is the only way to keep finds.
- [Random castle + fixed hazards may block fair paths] → Accept for now; follow-up can add placement constraints.
- [Unique item ids mean one sword max in stash] → Document; stacks later if needed.
- [Breaking change for existing tests using discoveredItemIds] → Update engine/web tests in the same change.

## Migration Plan

1. Implement engine stash/loadout/extract/consume; update unit tests.
2. Wire Goblin Woods corners + random castle + extraction tile type.
3. Update playtest UI (stash, loadout, banners, icons).
4. Archive OpenSpec into main specs when done.

No production data migration (session-only state).

## Open Questions

- None blocking; loadout has no slot cap (any subset of stash).
