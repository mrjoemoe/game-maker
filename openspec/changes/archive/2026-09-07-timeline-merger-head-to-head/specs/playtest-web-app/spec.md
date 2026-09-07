## ADDED Requirements

### Requirement: Head-to-head merge wire
The Play tab SHALL draw a merge connector from the ended branch’s last card to the destination branch’s head. That connector SHALL NOT splice into the destination stem as if the destination card had an extra parent.

#### Scenario: Merge line is end to end
- **WHEN** one branch has merged into another
- **THEN** a merge wire runs from the ended head to the continuing head and the destination stem stays a single parent-child line
