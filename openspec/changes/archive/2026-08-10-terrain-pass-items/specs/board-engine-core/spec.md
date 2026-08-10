## ADDED Requirements

### Requirement: Pass item traverses rough tiles
A tile type MAY declare `passItemId`. When the hero steps toward or onto that tile and the run inventory includes that item, the engine SHALL treat the tile as traversable: reveal it, move the hero onto it, and keep the run playing. If the tile effect is goal, the run SHALL be won instead of lost. Without the pass item, existing path-over / wall-block behavior SHALL apply. Side-wall crossings SHALL NOT be cleared by pass items.

#### Scenario: Wall tile with pass item is crossed
- **WHEN** the hero steps toward a full-cell wall tile whose `passItemId` is in inventory
- **THEN** the tile is revealed, the hero moves onto it, and the run stays playing

#### Scenario: Hazard without pass item still paths over
- **WHEN** the hero steps onto a trap or enemy tile and does not hold that tile's `passItemId`
- **THEN** the hero moves onto the tile and the run is lost with a path-over message

#### Scenario: Goal with pass item wins
- **WHEN** the hero steps onto a goal tile and holds that tile's `passItemId`
- **THEN** the hero moves onto the tile and the run status becomes won
