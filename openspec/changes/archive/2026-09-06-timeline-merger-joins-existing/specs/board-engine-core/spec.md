## MODIFIED Requirements

### Requirement: Merger joins two branches
Merger SHALL attach the **head of the incoming branch** to a chosen node on a **different destination branch**. The incoming branch SHALL end there and play SHALL continue on the destination branch. Merger SHALL NOT create a third branch or a new confluence node.

#### Scenario: Merge two heads
- **WHEN** Merger is applied from branch A onto a node of branch B
- **THEN** A’s head lists B’s node as a child, B’s node lists A’s head as an extra parent, A is marked merged, no new branch exists, and the traveler occupies B’s node
