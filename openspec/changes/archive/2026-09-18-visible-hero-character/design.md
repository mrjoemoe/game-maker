## Decisions

- CSS figure (head + body) tinted with the piece color, not a raster sprite, so it scales with the tile grid.
- Default facing is down. Later movement work can rotate the token.
- Only `typeId === "hero"` (or the configured `heroPieceId` instance) uses the full figure; meadow scout/marker stay as pawns.
