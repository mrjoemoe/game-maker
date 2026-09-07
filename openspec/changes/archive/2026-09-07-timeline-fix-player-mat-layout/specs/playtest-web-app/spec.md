## MODIFIED Requirements

### Requirement: Wide player mat and devices under hand
The Play tab SHALL give the player mat about **two thirds** of the lower row and the hand column about **one third**. Device A–H controls SHALL sit under the hand, not beside the mat. The three device slots SHALL be card-sized and SHALL show remaining uses as tokens. Blueprint cards SHALL show their use tokens. The player mat SHALL remain in document flow in that lower row and SHALL NOT overlay the timestream or the facedown piles.

#### Scenario: Mat is the wide column
- **WHEN** Timeline Game is shown on the Play tab at a desktop width
- **THEN** the player mat is the wider lower column and the hand column is narrower

#### Scenario: Devices sit under the hand
- **WHEN** Timeline Game is shown on the Play tab
- **THEN** Device A–H controls are in the hand column below the hand and piles

#### Scenario: Slots show use tokens
- **WHEN** a device occupies a player-mat slot
- **THEN** that slot is card-sized and shows remaining uses as tokens

#### Scenario: Player mat does not overlay piles
- **WHEN** Timeline Game is shown on the Play tab
- **THEN** the player mat sits below the timestream in the lower row and does not cover the Omega, action, or blueprint piles
