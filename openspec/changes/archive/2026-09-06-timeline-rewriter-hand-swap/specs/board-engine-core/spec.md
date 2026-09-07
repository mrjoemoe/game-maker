## MODIFIED Requirements

### Requirement: Rewriter replaces a played card
Rewriter SHALL swap one already-played card on a chosen timeline node with one card from the player’s hand. The timeline card SHALL move into the hand and the hand card SHALL occupy that node. Rewriter SHALL NOT return cards to a draw pile or pick a replacement from the catalog.

#### Scenario: Rewrite swaps a card
- **WHEN** Rewriter is applied with a timeline node that has a card and a card instance from hand
- **THEN** the node shows the former hand card and that former timeline card is in the hand
