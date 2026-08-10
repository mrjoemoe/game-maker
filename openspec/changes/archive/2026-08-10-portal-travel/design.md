## Decisions

- Four tile types `portal-1`…`portal-4` with `effect: { kind: "portal", portalId: n }`.
- Travel fails (path over) if not standing on a portal, destination missing/not face-up, or destination is the current portal.
- Successful travel moves the hero onto the destination, collects coins there, skips the step’s orthogonal move, and stays playing.
- Planner always lists all four Travel actions; legality is checked at run time.
