## Purpose

Provides a Docker-based development environment so Node, npm, Vite, and tests run inside containers without installing those tools on the host.

## ADDED Requirements

### Requirement: Containerized dependency install
The system SHALL install npm dependencies inside a Docker image build so the host does not need a project-local Node toolchain for day-to-day work.

#### Scenario: Image build installs dependencies
- **WHEN** the Docker image for the project is built
- **THEN** project dependencies are installed in the image without requiring a prior host `npm install`

### Requirement: Dev server via Compose
The system SHALL provide a Compose service that runs the Vite development server and exposes it on localhost for browser playtesting.

#### Scenario: Start web service
- **WHEN** the developer starts the web Compose service
- **THEN** the playtest app is reachable at `http://127.0.0.1:5173` (or the documented mapped port)

### Requirement: Tests via Compose
The system SHALL provide a Compose path to run the engine unit test suite inside a container.

#### Scenario: Run tests in container
- **WHEN** the developer runs the documented test Compose command
- **THEN** the engine Vitest suite executes inside a container and reports pass/fail

### Requirement: Host convenience wrapper
The system SHALL provide a shell wrapper script that can start, stop, open a shell, run tests, and build using Docker Compose without requiring the developer to remember raw Compose flags.

#### Scenario: Wrapper up command
- **WHEN** the developer runs the wrapper `up` command
- **THEN** the web development stack starts via Docker Compose
