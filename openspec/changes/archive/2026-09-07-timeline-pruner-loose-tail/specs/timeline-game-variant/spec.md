## MODIFIED Requirements

### Requirement: Device costs in the rulebook
The Timeline Game rulebook Devices section SHALL list the build cost for each device A–H: parts, minerals, crystals to run, culture / science / politics, uses, and how many of that blueprint are in the deck. Pruner’s effect SHALL say it cuts a loose tail from the head back to the latest junction.

#### Scenario: Brancher cost is listed
- **WHEN** a player reads the Devices section of Timeline Game’s rulebook
- **THEN** Brancher shows 2 parts, 5 minerals, 2 crystals, culture 4, science 2, politics 0, 2 uses, and 12 blueprints

#### Scenario: Every device has a numeric cost
- **WHEN** a player reads the Devices table
- **THEN** each of devices A–H has parts, minerals, crystal, society, uses, and blueprint-count numbers rather than only high/low wording

#### Scenario: Pruner cuts a loose tail
- **WHEN** a player reads Pruner’s effect
- **THEN** it describes cutting from the head down to the latest junction, not deleting descendant forks
