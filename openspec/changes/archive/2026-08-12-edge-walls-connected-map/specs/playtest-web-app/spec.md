## ADDED Requirements

### Requirement: Playtest UI renders edge walls
The playtest board SHALL visually indicate walls on the shared edges between cells rather than as independent per-tile face decorations that imply ownership of only one cell.

#### Scenario: Shared edge shows one wall segment
- **WHEN** two adjacent cells share a walled edge
- **THEN** the UI shows a single wall segment on that boundary
