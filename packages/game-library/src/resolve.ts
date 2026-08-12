import type {
  BoardConfig,
  GameDefinition,
  GameFeatures,
  InitialPiece,
  ItemDefinition,
  PieceTypeDefinition,
  TileTypeDefinition,
} from "@game-maker/engine";
import type {
  Catalog,
  CompatibilityRange,
  ComponentContribution,
  ComponentDefinition,
  ComponentId,
  DependencyEdge,
  FieldProvenance,
  ResolveResult,
  ResolveWarning,
  ResolvedVersion,
  VariantManifest,
} from "./types.js";
import {
  compareSemVer,
  isExactPin,
  majorOf,
  parseRange,
  satisfiesRange,
} from "./versions.js";

function setProv(
  provenance: FieldProvenance,
  path: string,
  componentId: ComponentId,
  contractVersion: string,
  viaOverride = false,
): void {
  provenance[path] = {
    componentId,
    contractVersion: contractVersion as `${number}.${number}.${number}`,
    viaOverride,
  };
}

function assertNoVariantImport(contribution: ComponentContribution): void {
  const blob = JSON.stringify(contribution);
  if (blob.includes("prototypes/") || blob.includes("variant:")) {
    throw new Error(
      "Component contribution must not reference variant-local paths",
    );
  }
}

function mergeById<T extends { id: string }>(
  existing: T[],
  incoming: T[],
  kind: string,
  sourceId: ComponentId,
): T[] {
  const map = new Map(existing.map((x) => [x.id, x]));
  for (const item of incoming) {
    if (map.has(item.id)) {
      throw new Error(
        `${kind} id collision: "${item.id}" from component ${sourceId}`,
      );
    }
    map.set(item.id, item);
  }
  return [...map.values()];
}

function applyContribution(
  draft: {
    id?: string;
    name?: string;
    templateId?: string;
    features?: GameFeatures;
    board?: Partial<BoardConfig> & { tileTypes?: TileTypeDefinition[] };
    pieceTypes?: PieceTypeDefinition[];
    initialPieces?: InitialPiece[];
    items?: ItemDefinition[];
    run?: GameDefinition["run"];
  },
  contribution: ComponentContribution,
  component: ComponentDefinition,
  provenance: FieldProvenance,
  overrides: Record<string, unknown> | undefined,
): void {
  assertNoVariantImport(contribution);
  const id = component.manifest.id;
  const ver = component.manifest.contractVersion;
  const allow = new Set(component.overrideAllowlist ?? []);

  let contrib = contribution;
  if (overrides && Object.keys(overrides).length > 0) {
    for (const key of Object.keys(overrides)) {
      if (!allow.has(key)) {
        throw new Error(
          `Override field "${key}" is not allowlisted on ${id}. Allowed: ${[...allow].join(", ") || "(none)"}`,
        );
      }
    }
    contrib = applyOverrides(contribution, overrides);
    for (const key of Object.keys(overrides)) {
      setProv(provenance, `override.${id}.${key}`, id, ver, true);
    }
  }

  if (contrib.templateId !== undefined) {
    if (draft.templateId && draft.templateId !== contrib.templateId) {
      throw new Error(
        `templateId conflict: ${draft.templateId} vs ${contrib.templateId} (${id})`,
      );
    }
    draft.templateId = contrib.templateId;
    setProv(provenance, "templateId", id, ver);
  }

  if (contrib.features) {
    draft.features = { ...(draft.features ?? {}), ...contrib.features };
    for (const key of Object.keys(contrib.features) as (keyof GameFeatures)[]) {
      setProv(provenance, `features.${key}`, id, ver);
    }
  }

  if (contrib.board) {
    const b: Partial<BoardConfig> & { tileTypes?: TileTypeDefinition[] } =
      draft.board ?? {};
    draft.board = b;
    if (contrib.board.grid) {
      b.grid = contrib.board.grid;
      setProv(provenance, "board.grid", id, ver);
    }
    if (contrib.board.defaultTileTypeId) {
      b.defaultTileTypeId = contrib.board.defaultTileTypeId;
      setProv(provenance, "board.defaultTileTypeId", id, ver);
    }
    if (contrib.board.sideWalls) {
      b.sideWalls = contrib.board.sideWalls;
      setProv(provenance, "board.sideWalls", id, ver);
    }
    if (contrib.board.coinWeights) {
      b.coinWeights = contrib.board.coinWeights;
      setProv(provenance, "board.coinWeights", id, ver);
    }
    if (contrib.board.tileTypes) {
      b.tileTypes = mergeById(
        b.tileTypes ?? [],
        contrib.board.tileTypes,
        "tile type",
        id,
      );
      for (const t of contrib.board.tileTypes) {
        setProv(provenance, `board.tileTypes.${t.id}`, id, ver);
      }
    }
    if (contrib.board.overrides) {
      b.overrides = [...(b.overrides ?? []), ...contrib.board.overrides];
      setProv(provenance, "board.overrides", id, ver);
    }
    if (contrib.board.randomPlacements) {
      b.randomPlacements = [
        ...(b.randomPlacements ?? []),
        ...contrib.board.randomPlacements,
      ];
      setProv(provenance, "board.randomPlacements", id, ver);
    }
  }

  if (contrib.pieceTypes) {
    draft.pieceTypes = mergeById(
      draft.pieceTypes ?? [],
      contrib.pieceTypes,
      "piece type",
      id,
    );
    for (const p of contrib.pieceTypes) {
      setProv(provenance, `pieceTypes.${p.id}`, id, ver);
    }
  }

  if (contrib.initialPieces) {
    const existing = draft.initialPieces ?? [];
    for (const piece of contrib.initialPieces) {
      if (existing.some((e) => e.id === piece.id)) {
        throw new Error(`initial piece id collision: "${piece.id}" from ${id}`);
      }
    }
    draft.initialPieces = [...existing, ...contrib.initialPieces];
    for (const p of contrib.initialPieces) {
      setProv(provenance, `initialPieces.${p.id}`, id, ver);
    }
  }

  if (contrib.items) {
    draft.items = mergeById(draft.items ?? [], contrib.items, "item", id);
    for (const item of contrib.items) {
      setProv(provenance, `items.${item.id}`, id, ver);
    }
  }

  if (contrib.run) {
    if (draft.run) {
      throw new Error(`run config already set; conflict from ${id}`);
    }
    draft.run = contrib.run;
    setProv(provenance, "run", id, ver);
  }
}

function applyOverrides(
  contribution: ComponentContribution,
  overrides: Record<string, unknown>,
): ComponentContribution {
  const next: ComponentContribution = structuredClone(contribution);
  for (const [key, value] of Object.entries(overrides)) {
    if (key === "label" || key === "color" || key === "icon") {
      const tile = next.board?.tileTypes?.[0];
      const piece = next.pieceTypes?.[0];
      const item = next.items?.[0];
      if (tile && key in tile) (tile as Record<string, unknown>)[key] = value;
      else if (piece && key in piece)
        (piece as Record<string, unknown>)[key] = value;
      else if (item && key in item)
        (item as Record<string, unknown>)[key] = value;
      else {
        throw new Error(`Cannot apply override "${key}": no target field`);
      }
    } else if (key.startsWith("tile.") && next.board?.tileTypes?.[0]) {
      const field = key.slice("tile.".length);
      (next.board.tileTypes[0] as Record<string, unknown>)[field] = value;
    } else if (key.startsWith("piece.") && next.pieceTypes?.[0]) {
      const field = key.slice("piece.".length);
      (next.pieceTypes[0] as Record<string, unknown>)[field] = value;
    } else if (key.startsWith("item.") && next.items?.[0]) {
      const field = key.slice("item.".length);
      (next.items[0] as Record<string, unknown>)[field] = value;
    } else {
      throw new Error(`Unsupported override path: ${key}`);
    }
  }
  return next;
}

function selectVersion(
  catalog: Catalog,
  id: ComponentId,
  range: CompatibilityRange,
): ComponentDefinition {
  const parsed = parseRange(range);
  const candidates = catalog
    .list()
    .filter((c) => c.manifest.id === id)
    .filter((c) => satisfiesRange(c.manifest.contractVersion, range));

  if (candidates.length === 0) {
    const available = catalog
      .list()
      .filter((c) => c.manifest.id === id)
      .map((c) => c.manifest.contractVersion);
    if (available.length === 0) {
      throw new Error(`Unknown component "${id}"`);
    }
    throw new Error(
      `No version of "${id}" satisfies ${range}. Available: ${available.join(", ")}`,
    );
  }

  if (parsed.kind === "exact") {
    const exact = candidates.find(
      (c) => c.manifest.contractVersion === parsed.exact,
    );
    if (!exact) {
      throw new Error(`Pinned version ${parsed.exact} of "${id}" not found`);
    }
    return exact;
  }

  return candidates.sort((a, b) =>
    compareSemVer(b.manifest.contractVersion, a.manifest.contractVersion),
  )[0];
}

function collectClosure(
  catalog: Catalog,
  roots: { id: ComponentId; range: CompatibilityRange }[],
  variantId: string,
): {
  ordered: ComponentDefinition[];
  graph: DependencyEdge[];
  resolved: Map<ComponentId, ComponentDefinition>;
  ranges: Map<ComponentId, CompatibilityRange>;
} {
  const resolved = new Map<ComponentId, ComponentDefinition>();
  const ranges = new Map<ComponentId, CompatibilityRange>();
  const graph: DependencyEdge[] = [];
  const visiting = new Set<ComponentId>();
  const visited = new Set<ComponentId>();
  const ordered: ComponentDefinition[] = [];

  function visit(
    id: ComponentId,
    range: CompatibilityRange,
    from: ComponentId | `variant:${string}`,
  ): void {
    graph.push({ from, to: id });
    const existingRange = ranges.get(id);
    if (existingRange) {
      const a = parseRange(existingRange);
      const b = parseRange(range);
      if (a.major !== b.major) {
        throw new Error(
          `Incompatible dependency ranges for ${id}: ${existingRange} vs ${range}`,
        );
      }
      if (isExactPin(existingRange) && isExactPin(range) && existingRange !== range) {
        throw new Error(
          `Conflicting exact pins for ${id}: ${existingRange} vs ${range}`,
        );
      }
    } else {
      ranges.set(id, range);
    }

    if (visiting.has(id)) {
      throw new Error(`Dependency cycle involving ${id}`);
    }
    if (visited.has(id)) {
      return;
    }

    visiting.add(id);
    const component = selectVersion(catalog, id, ranges.get(id)!);
    resolved.set(id, component);

    for (const dep of component.manifest.dependencies ?? []) {
      visit(dep.id, dep.range, id);
    }

    visiting.delete(id);
    visited.add(id);
    ordered.push(component);
  }

  for (const root of roots) {
    visit(root.id, root.range, `variant:${variantId}`);
  }

  return { ordered, graph, resolved, ranges };
}

export function resolveVariant(
  manifest: VariantManifest,
  catalog: Catalog,
): ResolveResult {
  const warnings: ResolveWarning[] = [];
  const { ordered, graph, ranges } = collectClosure(
    catalog,
    manifest.components.map((c) => ({ id: c.id, range: c.range })),
    manifest.id,
  );

  // Params from variant refs (first wins for a component)
  const paramsById = new Map<ComponentId, Record<string, unknown>>();
  const pinReasons = new Map<ComponentId, string | undefined>();
  for (const ref of manifest.components) {
    if (ref.params) paramsById.set(ref.id, ref.params);
    pinReasons.set(ref.id, ref.pinReason);
    if (isExactPin(ref.range) && !ref.pinReason) {
      warnings.push({
        code: "pin-missing-reason",
        message: `Exact pin ${ref.id}@${ref.range} should include pinReason`,
        componentId: ref.id,
      });
    }
  }

  const overridesById = new Map(
    (manifest.overrides ?? []).map((o) => [o.componentId, o.fields]),
  );

  for (const component of ordered) {
    const life = component.manifest.lifecycle ?? { state: "active" as const };
    if (life.state === "retired") {
      const range = ranges.get(component.manifest.id)!;
      if (!isExactPin(range)) {
        throw new Error(
          `Retired component ${component.manifest.id} cannot be selected unpinned. ${life.migration ?? life.replacementId ?? ""}`,
        );
      }
    }
    if (life.state === "deprecated") {
      warnings.push({
        code: "deprecated",
        message: `Component ${component.manifest.id} is deprecated. ${life.migration ?? `Use ${life.replacementId}`}`,
        componentId: component.manifest.id,
      });
    }
  }

  // Apply in dependency order (deps before dependents). Variant composition order
  // for roots is preserved among siblings by sorting roots as listed after deps.
  const rootOrder = new Map(
    manifest.components.map((c, i) => [c.id, i] as const),
  );
  const applyOrder = [...ordered].sort((a, b) => {
    const ai = rootOrder.get(a.manifest.id);
    const bi = rootOrder.get(b.manifest.id);
    if (ai !== undefined && bi !== undefined) return ai - bi;
    if (ai !== undefined) return 1;
    if (bi !== undefined) return -1;
    return 0;
  });

  const draft: {
    id?: string;
    name?: string;
    templateId?: string;
    features?: GameFeatures;
    board?: Partial<BoardConfig> & { tileTypes?: TileTypeDefinition[] };
    pieceTypes?: PieceTypeDefinition[];
    initialPieces?: InitialPiece[];
    items?: ItemDefinition[];
    run?: GameDefinition["run"];
  } = {
    id: manifest.id,
    name: manifest.name,
  };
  const provenance: FieldProvenance = {};
  let extensions: { banner?: string; rulebook?: string } = {};

  for (const component of applyOrder) {
    const contribution = component.contribute({
      params: paramsById.get(component.manifest.id) ?? {},
    });
    applyContribution(
      draft,
      contribution,
      component,
      provenance,
      overridesById.get(component.manifest.id),
    );
    if (contribution.extensions) {
      extensions = { ...extensions, ...contribution.extensions };
    }
  }

  if (manifest.extensions) {
    extensions = {
      banner: manifest.extensions.banner ?? extensions.banner,
      rulebook: manifest.extensions.rulebook ?? extensions.rulebook,
    };
  }

  if (!draft.templateId) {
    throw new Error(`Variant ${manifest.id} resolved without templateId`);
  }
  if (!draft.board?.grid || !draft.board.tileTypes?.length || !draft.board.defaultTileTypeId) {
    throw new Error(`Variant ${manifest.id} resolved with incomplete board`);
  }
  if (!draft.pieceTypes?.length) {
    throw new Error(`Variant ${manifest.id} resolved without pieceTypes`);
  }
  if (!draft.initialPieces?.length) {
    throw new Error(`Variant ${manifest.id} resolved without initialPieces`);
  }

  const definition: GameDefinition = {
    id: manifest.id,
    name: manifest.name,
    templateId: draft.templateId,
    features: draft.features,
    board: {
      grid: draft.board.grid,
      tileTypes: draft.board.tileTypes,
      defaultTileTypeId: draft.board.defaultTileTypeId,
      overrides: draft.board.overrides,
      sideWalls: draft.board.sideWalls,
      randomPlacements: draft.board.randomPlacements,
      coinWeights: draft.board.coinWeights,
    },
    pieceTypes: draft.pieceTypes,
    initialPieces: draft.initialPieces,
    items: draft.items,
    run: draft.run,
  };

  const resolvedVersions: ResolvedVersion[] = applyOrder.map((c) => ({
    id: c.manifest.id,
    contractVersion: c.manifest.contractVersion,
    range: ranges.get(c.manifest.id)!,
    pinned: isExactPin(ranges.get(c.manifest.id)!),
  }));

  return {
    definition,
    extensions,
    provenance,
    warnings,
    resolvedVersions,
    dependencyGraph: graph,
  };
}

export function findConsumers(
  catalog: Catalog,
  componentId: ComponentId,
  variants: VariantManifest[],
): string[] {
  const consumers = new Set<string>();

  function dependsOn(
    id: ComponentId,
    range: CompatibilityRange,
    seen: Set<ComponentId>,
  ): boolean {
    if (id === componentId) return true;
    if (seen.has(id)) return false;
    seen.add(id);
    let component: ComponentDefinition;
    try {
      component = selectVersion(catalog, id, range);
    } catch {
      return false;
    }
    for (const dep of component.manifest.dependencies ?? []) {
      if (dependsOn(dep.id, dep.range, seen)) return true;
    }
    return false;
  }

  for (const variant of variants) {
    for (const ref of variant.components) {
      if (dependsOn(ref.id, ref.range, new Set())) {
        consumers.add(variant.id);
        break;
      }
    }
  }
  return [...consumers].sort();
}

export { selectVersion, majorOf };
