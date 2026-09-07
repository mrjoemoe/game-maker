## MODIFIED Requirements

### Requirement: Timeline playtest canvas
When the active prototype enables timeline mode, the Play tab SHALL render a branching timeline with **epoch at the bottom** and later nodes stacked **upward** on separate branch columns, plus a **1–20 row ruler** for path depth. The traveler token SHALL appear on the current node. Timeline nodes SHALL be compact (about half the previous card height). Hovering a timeline node SHALL show the cumulative culture, science, and politics on the path from epoch to that node. Wires SHALL distinguish **same-branch stems** from **fork** and **merge** connectors: forks and merges SHALL route through gutters and row gaps so they do not overlap cards or branch mats. When no local path can miss those tiles, the connector SHALL split: each end SHALL show the **same letter** so the join is still readable. A **preserved** branch SHALL have a yellow column wash behind its lane so the lock is obvious. The **primary** branch SHALL sit in the horizontal center of the timestream so later branches can open to its left and its right.

#### Scenario: Seeded timeline is visible
- **WHEN** Timeline Game loads on the Play tab
- **THEN** the epoch node sits at the bottom with a primary branch mat, at least one event node stacked above it, and row numbers 1–20 along the time axis

#### Scenario: Hover shows society at that moment
- **WHEN** the player hovers a timeline card
- **THEN** the UI shows culture, science, and politics totaled along the path to that card

#### Scenario: Fork wire is distinct from a stem
- **WHEN** a branch is created from a timeline node
- **THEN** the connector to the new column is a side-routed fork wire, visually distinct from the vertical stem on the parent timeline

#### Scenario: Blocked fork uses letter jump
- **WHEN** a fork cannot be routed through nearby gutters without overlapping a card or mat
- **THEN** each end of the connector is labeled with the same letter and the stroke does not cross the blocking tile

#### Scenario: Preserved branch is yellow
- **WHEN** a branch is preserved
- **THEN** that branch’s column has a yellow background behind its cards and mat

#### Scenario: Primary branch starts centered
- **WHEN** Timeline Game loads on the Play tab
- **THEN** the primary branch sits in the horizontal center of the timestream with open space to both sides

#### Scenario: Forks open left and right
- **WHEN** two branches are created from the primary timeline
- **THEN** one new column is to the left of the primary branch and the other is to the right
