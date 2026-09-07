## ADDED Requirements

### Requirement: Canonical timeline feature bundle
The library SHALL include a `core/timeline` feature bundle that contributes the timeline template, timeline-mode flag, placeholder cards and devices A–H, a dummy board for resolver compatibility, and a traveler piece.

#### Scenario: Catalog lists core/timeline
- **WHEN** the catalog is listed
- **THEN** `core/timeline` is present as an active feature bundle

#### Scenario: Timeline contribution includes eight devices
- **WHEN** `core/timeline` is resolved into a variant
- **THEN** the definition’s timeline config includes Brancher, Reverser, Relocator, Pruner, Merger, Rewriter, Preserver, and Jumper
