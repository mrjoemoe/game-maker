## MODIFIED Requirements

### Requirement: Components are independently composable
The library SHALL support independently reusable data and behavior components, including tile types, piece types, items, rules, board setup or generation (including edge-wall count/seed), feature bundles, UI presentation metadata, and extension modules. A component MAY depend on other components through declared identifiers but MUST NOT depend on a consuming variant. The `rules/programmed-run` component SHALL default `programLength` to 10 atomic actions.

#### Scenario: Feature bundle brings dependencies
- **WHEN** a variant includes a feature bundle that declares item and rule dependencies
- **THEN** the resolver includes those dependencies in the resolved game definition

#### Scenario: Board contributes edge walls
- **WHEN** a board component declares `edgeWalls: { count: 15 }`
- **THEN** the resolved game definition includes that edge-wall configuration

#### Scenario: Programmed-run defaults to ten actions
- **WHEN** a variant uses `rules/programmed-run` without overriding `programLength`
- **THEN** the resolved run config has `programLength` 10

#### Scenario: Component reaches into variant
- **WHEN** a component imports or references variant-local content not declared through its public contract
- **THEN** validation rejects the dependency
