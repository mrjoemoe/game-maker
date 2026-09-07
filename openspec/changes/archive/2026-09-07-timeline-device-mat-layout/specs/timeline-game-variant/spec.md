## MODIFIED Requirements

### Requirement: Device costs in the rulebook
The Timeline Game rulebook Devices section SHALL list the build cost for each device A–H: parts, minerals, crystals to run, culture / science / politics, uses, and how many of that blueprint are in the deck.

#### Scenario: Brancher cost is listed
- **WHEN** a player reads the Devices section of Timeline Game’s rulebook
- **THEN** Brancher shows 2 parts, 5 minerals, 2 crystals, culture 4, science 2, politics 0, 2 uses, and 12 blueprints

#### Scenario: Every device has a numeric cost
- **WHEN** a player reads the Devices table
- **THEN** each of devices A–H has parts, minerals, crystal, society, uses, and blueprint-count numbers rather than only high/low wording

## ADDED Requirements

### Requirement: Blueprint deck counts
Timeline Game SHALL put the listed number of each device blueprint into the blueprint pile: Brancher 12, Reverser 12, Relocator 6, Pruner 3, Merger 3, Rewriter 24, Preserver 3, Jumper 12.

#### Scenario: Rewriter has the largest blueprint stack
- **WHEN** Timeline Game is resolved from `core/timeline`
- **THEN** there are 24 Rewriter blueprint copies and 12 Brancher blueprint copies
