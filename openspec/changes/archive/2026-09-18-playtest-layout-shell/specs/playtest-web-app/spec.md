## ADDED Requirements

### Requirement: Compact run-mode shell
When run mode is enabled, the playtest app SHALL use a compact header and a wide single-column stage whose actions panel, board, and under-board tools do not overlap. On a wide viewport the inventory SHALL sit beside the tile tally and debug section rather than stretching the page into one endless column. The action track SHALL keep ten slots in a single row (scroll horizontally if needed) so slot 10 is not wrapped onto a second row of five.

#### Scenario: Wide under-board row
- **WHEN** run mode is shown at a desktop width
- **THEN** inventory is not stacked above both tally and debug in a single full-width column if there is room for two columns

#### Scenario: Track stays one row
- **WHEN** the action track is shown
- **THEN** its ten slots share one row
