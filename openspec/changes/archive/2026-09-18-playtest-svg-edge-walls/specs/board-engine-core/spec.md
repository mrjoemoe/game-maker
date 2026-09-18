## ADDED Requirements

### Requirement: Edge wall segment listing
The engine SHALL parse stored undirected edge-wall keys (`h:x,y` and `v:x,y`) into renderable segments so consumers can draw each shared wall once.

#### Scenario: Horizontal key becomes a vertical boundary
- **WHEN** the engine lists segments for key `h:1,2`
- **THEN** the result includes an `h` segment at x=1, y=2 (the east/west boundary between (1,2) and (2,2))

#### Scenario: Vertical key becomes a horizontal boundary
- **WHEN** the engine lists segments for key `v:0,0`
- **THEN** the result includes a `v` segment at x=0, y=0 (the north/south boundary between (0,0) and (0,1))

#### Scenario: Invalid keys are skipped
- **WHEN** the engine lists segments for a mix of valid keys and the string `nope`
- **THEN** only the valid keys appear as segments
