## Decisions

Only side-wall generation is re-rolled (terrain overrides stay from prototype config). Run-mode `reset` assigns a new `board.sideWalls.seed` on the definition used for `createInitialState`. Soft reset unchanged.
