## REMOVED Requirements

### Requirement: Action deck only

## ADDED Requirements

### Requirement: Omega, action, and blueprint piles
Timeline Game SHALL keep three facedown piles: **Omega events** (person, place, thing; 30 cards), **action cards** (society, invention, resource, Random Event, Draw Blueprint), and **blueprints**. Hand draws SHALL come from the action pile. Playing Random Event SHALL place the top Omega card on the timeline. Playing Draw Blueprint SHALL add the top blueprint to the hand.

#### Scenario: Thirty Omega events
- **WHEN** Timeline Game is resolved from `core/timeline`
- **THEN** there are 30 person/place/thing cards

#### Scenario: Random Event places Omega
- **WHEN** the player plays a Random Event action on a timeline moment
- **THEN** the top Omega event is placed there and the Random Event card is not left on that node

#### Scenario: Draw Blueprint fills the hand
- **WHEN** the player plays Draw Blueprint
- **THEN** the top blueprint is added to the hand

#### Scenario: Rulebook names the three piles
- **WHEN** a player reads the Cards section of Timeline Game’s rulebook
- **THEN** it describes Omega events, action cards, and blueprints as separate piles
