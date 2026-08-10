## Decisions

1. **`passItemId` on the tile type** (not reverse lookup from items) so the tally can show “Pit → Makeshift Bridge” directly.
2. **With pass item in inventory**, treat the destination as traversable: reveal, move on, stay playing. Full-cell walls move the hero onto the cell (unlike the blocked-without-item case). Goal + pass item → win.
3. **Without the item**, keep current safe-path behavior (path over / wall bump).
4. **Side walls** stay independent — pass items do not clear edge walls.
5. **Caches** have no `passItemId`. Item acquisition from caches is unchanged (still path-over for now); pass-item catalog is defined for planning/UI and for when inventory is seeded (soft reset / tests).
6. **Goblin Woods item map**: Pit→Makeshift Bridge, River→Rope Bridge, Thicket→Machete, Snare→Knife, Goblin→Sword, Brute→Spear, Villain→Charm, Castle→Sneak.
