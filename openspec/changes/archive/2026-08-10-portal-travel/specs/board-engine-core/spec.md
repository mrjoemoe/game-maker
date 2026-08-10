## ADDED Requirements

### Requirement: Portal tiles and travel action
A tile type MAY declare effect kind `portal` with a numeric `portalId`. Portals are safe to step onto. A `travelToPortal` program action while standing on a portal SHALL teleport the hero to the board cell whose portal effect matches the target id when that destination cell is already face-up and is not the hero’s current cell; otherwise the run is lost. Successful travel SHALL NOT apply that step’s orthogonal move. Travel MAY collect coins on the destination as a safe landing.

#### Scenario: Travel to a discovered portal
- **WHEN** the hero stands on Portal 1 and Portal 2 is face-up and programs travelToPortal 2
- **THEN** the hero is on Portal 2’s cell and the run stays playing

#### Scenario: Travel to an undiscovered portal fails
- **WHEN** the hero stands on a portal and programs travelToPortal to a face-down portal
- **THEN** the run is lost

#### Scenario: Travel off a portal fails
- **WHEN** the hero is not on a portal and programs travelToPortal
- **THEN** the run is lost
