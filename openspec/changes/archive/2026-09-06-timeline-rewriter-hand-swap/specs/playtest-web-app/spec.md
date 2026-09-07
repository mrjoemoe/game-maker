## ADDED Requirements

### Requirement: Rewriter targeting uses the hand
While Rewriter is armed, the Play tab SHALL instruct the player to click a timeline card, then a card in hand. Completing those two clicks SHALL swap those cards. The debug catalog SHALL NOT apply Rewriter.

#### Scenario: Banner asks for a hand card
- **WHEN** Rewriter has a timeline card selected
- **THEN** the banner tells the player to click a card in hand to swap onto that moment
