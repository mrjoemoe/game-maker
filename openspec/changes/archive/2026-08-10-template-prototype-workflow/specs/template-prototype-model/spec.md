## Purpose

Defines how reusable templates relate to named game prototypes so multiple configurable game versions can coexist without forking template source.

## ADDED Requirements

### Requirement: Templates hold reusable source
The repository SHALL keep reusable tile-board template source and documentation under `templates/<template-id>/`. New playable games MUST NOT be created by copying template source into a one-off fork when a prototype config is sufficient.

#### Scenario: Template directory exists for tile-board
- **WHEN** a developer inspects `templates/`
- **THEN** a `tile-board` template is present with documentation describing how prototypes bind to it

### Requirement: Prototypes are named game versions
Each playable game version SHALL live under `prototypes/<prototype-id>/` and SHALL include a game config that names the game, selects a template, defines tile/piece content, and declares feature flags.

#### Scenario: Prototype loads distinct display name
- **WHEN** a prototype config sets a display name different from the template id
- **THEN** the playtest UI shows that prototype display name

### Requirement: Config controls flip capability
A prototype config SHALL be able to enable or disable tile flipping. When disabled, flip actions MUST NOT change tile face state.

#### Scenario: Flip disabled
- **WHEN** a prototype sets tile flip to disabled and a flip action is requested
- **THEN** tile face states remain unchanged

### Requirement: Optional prototype extensions
A prototype MAY include an `extensions/` directory for prototype-unique code. The absence of extensions MUST still allow the prototype to run on the selected template.

#### Scenario: Prototype without extensions runs
- **WHEN** a prototype has a valid config and no extensions
- **THEN** the playtest app launches that prototype successfully

### Requirement: Simultaneous prototype launches
The development tooling SHALL allow launching more than one prototype at a time by selecting a prototype id and a host port.

#### Scenario: Two prototypes on different ports
- **WHEN** the developer starts prototype A on port 5173 and prototype B on port 5174
- **THEN** both playtest instances are reachable on their respective localhost ports
