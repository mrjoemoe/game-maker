## MODIFIED Requirements

### Requirement: Player mat and debug device dock
The Play tab SHALL show a player mat (parts, minerals, crystals, up to 3 device slots, blueprints, objectives). In debug mode it SHALL provide always-available Device A–H controls with targeting instructions, plus debug draws and the ability to add any catalog card to hand. Hand cards SHALL use the same type coloring as timeline cards (not an unmarked white face). While a device is armed, the Play tab SHALL show a **top banner** naming that device and the next click required to use it; the matching dock control SHALL appear armed until the player completes the action or cancels. Timeline nodes SHALL NOT be labeled or drawn as Open rift tiles.

#### Scenario: Branch from the dock
- **WHEN** the player activates Brancher, a timeline node, and an action card in hand
- **THEN** a new branch lane and branch mat appear from that node with the chosen card as the first card on the branch

#### Scenario: Armed device banner
- **WHEN** the player clicks Brancher in the device dock
- **THEN** a top banner names Brancher and tells the player to click the timestream moment to fork from
- **AND** the Brancher dock control appears armed

#### Scenario: Brancher asks for a card
- **WHEN** Brancher has a fork node selected
- **THEN** the banner tells the player to click an action card in hand to lay on the new branch

#### Scenario: Debug draw into hand
- **WHEN** the player uses debug draw-action
- **THEN** a card appears in the hand panel with a visible type color and label
