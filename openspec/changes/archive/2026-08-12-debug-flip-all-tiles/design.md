## Decisions

- Implement as a UI display override (`debugShowAll`) rather than mutating every cell’s `isFaceUp`, so turning debug off restores hidden tiles automatically while keeping play-revealed tiles face-up.
- Place a Debug section below the tile tally in the board column.
