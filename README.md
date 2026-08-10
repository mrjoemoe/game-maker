# Game Maker

Configurable tile board game engine with **templates** (reusable) and **prototypes** (named game versions).

See [AGENT.md](AGENT.md) for the operating model agents must follow.

## Quick start (Docker)

```bash
chmod +x ./dev.sh
./dev.sh up meadow-v1          # http://127.0.0.1:5173
./dev.sh up quiet-glade 5174   # second prototype at the same time
```

| Command | What it does |
|---------|----------------|
| `./dev.sh up <proto> [port]` | Start a prototype playtest |
| `./dev.sh down <proto>` | Stop that prototype's Compose project |
| `./dev.sh list` | List prototype folders |
| `./dev.sh test` | Run engine Vitest in Docker |
| `./dev.sh shell <proto>` | Shell in container |

## Layout

- `packages/engine` — headless layered engine
- `packages/web` — React playtest shell (tile-board template runtime)
- `templates/tile-board` — template docs/metadata
- `prototypes/*` — named games (config + optional extensions)
- `external/` — curated skills + prior-art reference submodules
- `openspec/` — specs and changes

## New game version

Use the `prototype-from-template` skill / follow `templates/tile-board/TEMPLATE.md`:
add `prototypes/<id>`, register it, launch with `./dev.sh up <id>`.

## Reference submodules

```bash
git submodule update --init --recursive
```
