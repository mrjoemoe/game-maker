import type {
  BoardConfig,
  CellOverride,
  GameDefinition,
  GameFeatures,
  InitialPiece,
  ItemDefinition,
  PieceTypeDefinition,
  RandomTilePlacement,
  RunConfig,
  TileTypeDefinition,
} from "@game-maker/engine";

/** Globally unique component id: `namespace/name`. */
export type ComponentId = string;

export type ComponentKind =
  | "tile"
  | "piece"
  | "item"
  | "rule"
  | "board"
  | "feature-bundle"
  | "presentation"
  | "extension";

export type LifecycleState = "active" | "deprecated" | "retired";

export type SemVer = `${number}.${number}.${number}`;

export type CompatibilityRange = `^${number}` | SemVer;

export type ComponentDependency = {
  id: ComponentId;
  range: CompatibilityRange;
};

export type ComponentLifecycle = {
  state: LifecycleState;
  /** Required when deprecated or retired. */
  replacementId?: ComponentId;
  migration?: string;
};

export type ComponentDocs = {
  summary: string;
  playerFacing?: string;
  developerNotes?: string;
};

export type ComponentManifest = {
  id: ComponentId;
  kind: ComponentKind;
  /** Schema of the contribution shape for this kind. */
  schemaVersion: number;
  /** Public contract version (semver). Major gates breaking changes. */
  contractVersion: SemVer;
  dependencies?: ComponentDependency[];
  lifecycle?: ComponentLifecycle;
  owner: string;
  docs: ComponentDocs;
};

export type Provenance = {
  componentId: ComponentId;
  contractVersion: SemVer;
  viaOverride?: boolean;
};

export type FieldProvenance = Record<string, Provenance>;

/** Kind-specific contribution folded into a GameDefinition. */
export type ComponentContribution = {
  templateId?: string;
  features?: GameFeatures;
  board?: {
    grid?: BoardConfig["grid"];
    tileTypes?: TileTypeDefinition[];
    defaultTileTypeId?: string;
    overrides?: CellOverride[];
    edgeWalls?: BoardConfig["edgeWalls"];
    randomPlacements?: RandomTilePlacement[];
    coinWeights?: BoardConfig["coinWeights"];
  };
  pieceTypes?: PieceTypeDefinition[];
  initialPieces?: InitialPiece[];
  items?: ItemDefinition[];
  run?: RunConfig;
  /** Extension-like metadata merged into PrototypeExtensions. */
  extensions?: {
    banner?: string;
    rulebook?: string;
  };
};

export type ComponentFactoryContext = {
  params: Record<string, unknown>;
};

export type ComponentDefinition = {
  manifest: ComponentManifest;
  /** Allowed override field paths (dot notation), e.g. `label`, `color`. */
  overrideAllowlist?: string[];
  contribute: (ctx: ComponentFactoryContext) => ComponentContribution;
};

export type ComponentRef = {
  id: ComponentId;
  range: CompatibilityRange;
  params?: Record<string, unknown>;
  /** Exact pin requires a reason. */
  pinReason?: string;
};

export type VariantOverride = {
  componentId: ComponentId;
  /** Allowed fields only; nested keys supported for presentation. */
  fields: Record<string, unknown>;
};

export type VariantExtensions = {
  banner?: string;
  rulebook?: string;
  /** Why this remains variant-local. */
  localReason?: string;
};

export type VariantManifest = {
  id: string;
  name: string;
  components: ComponentRef[];
  overrides?: VariantOverride[];
  extensions?: VariantExtensions;
};

export type ResolveWarning = {
  code: string;
  message: string;
  componentId?: ComponentId;
};

export type ResolvedVersion = {
  id: ComponentId;
  contractVersion: SemVer;
  range: CompatibilityRange;
  pinned: boolean;
};

export type DependencyEdge = {
  from: ComponentId | `variant:${string}`;
  to: ComponentId;
};

export type ResolveResult = {
  definition: GameDefinition;
  extensions: {
    banner?: string;
    rulebook?: string;
  };
  provenance: FieldProvenance;
  warnings: ResolveWarning[];
  resolvedVersions: ResolvedVersion[];
  dependencyGraph: DependencyEdge[];
};

export type Catalog = {
  /** All retained implementations keyed by `${id}@${major}`. */
  entries: Map<string, ComponentDefinition>;
  /** Lookup helpers. */
  list(): ComponentDefinition[];
  get(id: ComponentId, major?: number): ComponentDefinition | undefined;
  register(component: ComponentDefinition): void;
};
