## ADDED Requirements

### Requirement: Facedown card piles
The Play tab SHALL show three facedown piles: Omega events with **yellow** backs, action cards with **green** backs, and blueprints. The Omega pile SHALL represent the remaining person/place/thing cards. Clicking the action pile SHALL draw into the hand.

#### Scenario: Omega pile is yellow
- **WHEN** Timeline Game is shown on the Play tab
- **THEN** a facedown Omega pile with a yellow back is visible with a remaining-card count

#### Scenario: Action pile draws
- **WHEN** the player activates the green action pile
- **THEN** the top action card is added to the hand

## MODIFIED Requirements

### Requirement: Player mat and debug device dock
The Play tab SHALL show a player mat (parts, minerals, crystals, up to 3 device slots, blueprints, objectives). In debug mode it SHALL provide always-available Device A–H controls with targeting instructions, plus a debug draw from the **green action pile** and the ability to add any catalog card to hand. It SHALL NOT offer a Draw random control. Hand cards SHALL use the same type coloring as timeline cards (not an unmarked white face). While a device is armed, the Play tab SHALL show a **top banner** naming that device and the next click required to use it; the matching dock control SHALL appear armed until the player completes the action or cancels. Timeline nodes SHALL NOT be labeled or drawn as Open rift tiles. Merger targeting copy SHALL tell the player which branch ends and which branch it continues into.

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
- **WHEN** the player activates the green action pile
- **THEN** a card appears in the hand panel with a visible type color and label

#### Scenario: Merger names the ending branch
- **WHEN** Merger is armed
- **THEN** the banner says to click the branch that ends, then the card on the timeline it continues into

#### Scenario: No draw-random control
- **WHEN** Timeline Game is shown on the Play tab
- **THEN** the hand panel shows the three facedown piles and does not offer a Draw random control
