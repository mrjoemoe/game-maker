## Purpose

Docker development tooling launches a chosen prototype on a chosen host port so multiple prototypes can run concurrently.

## ADDED Requirements

### Requirement: Prototype-aware up command
The `dev.sh` wrapper SHALL accept a prototype id (and optional host port) when starting the web playtest service, and SHALL pass that selection into the container environment.

#### Scenario: Up with prototype and port
- **WHEN** the developer runs `./dev.sh up meadow-v1 5174`
- **THEN** the web service starts serving that prototype on host port 5174

### Requirement: Compose mounts prototypes
The Docker Compose web service SHALL mount the `prototypes/` directory into the container so prototype configs are available at runtime.

#### Scenario: Prototype folder visible in container
- **WHEN** the web service is running
- **THEN** files under `prototypes/` are available to the app process
