#!/usr/bin/env bash
# Docker convenience wrapper — no host Node required for day-to-day work.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

usage() {
  cat <<'EOF'
Usage: ./dev.sh <command> [args]

Commands:
  up <prototype> [port]   Start a prototype (default port 5173)
  down [prototype]        Stop stack for a prototype (or default meadow-v1)
  shell [prototype]       Shell in the web image for a prototype project
  test                    Run engine unit tests in Docker
  build                   Build the Docker image
  list                    List known prototype folders

Examples:
  ./dev.sh up meadow-v1
  ./dev.sh up quiet-glade 5174
  ./dev.sh down quiet-glade
EOF
}

project_name_for() {
  local proto="$1"
  # Compose project names: lowercase, digits, dashes, underscores.
  echo "gm-${proto}" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9_-]/-/g'
}

list_prototypes() {
  if [[ -d prototypes ]]; then
    find prototypes -mindepth 1 -maxdepth 1 -type d ! -name '_*' -printf '%f\n' | sort
  fi
}

cmd="${1:-}"
shift || true

case "$cmd" in
  list)
    list_prototypes
    ;;
  up)
    PROTO="${1:-meadow-v1}"
    PORT="${2:-5173}"
    if [[ ! -d "prototypes/${PROTO}" ]]; then
      echo "Unknown prototype: ${PROTO}" >&2
      echo "Known:" >&2
      list_prototypes >&2
      exit 1
    fi
    export VITE_PROTOTYPE="$PROTO"
    export HOST_PORT="$PORT"
    PROJECT="$(project_name_for "$PROTO")"
    echo "Starting prototype '${PROTO}' on http://127.0.0.1:${PORT} (compose project ${PROJECT})"
    docker compose -p "$PROJECT" up --build web
    ;;
  down)
    PROTO="${1:-meadow-v1}"
    PROJECT="$(project_name_for "$PROTO")"
    docker compose -p "$PROJECT" down
    ;;
  shell)
    PROTO="${1:-meadow-v1}"
    export VITE_PROTOTYPE="$PROTO"
    export HOST_PORT="${HOST_PORT:-5173}"
    PROJECT="$(project_name_for "$PROTO")"
    docker compose -p "$PROJECT" run --rm --entrypoint sh web
    ;;
  test)
    docker compose --profile test run --rm --build test
    ;;
  build)
    docker compose build
    ;;
  *)
    usage
    exit 1
    ;;
esac
