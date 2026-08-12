import type {
  CompatibilityRange,
  ComponentContribution,
  ComponentDefinition,
  ComponentFactoryContext,
  ComponentId,
  ComponentManifest,
  VariantManifest,
  VariantOverride,
  ComponentRef,
} from "./types.js";
import { parseSemVer } from "./versions.js";

const ID_RE = /^[a-z0-9-]+\/[a-z0-9-]+$/;
const KINDS = new Set([
  "tile",
  "piece",
  "item",
  "rule",
  "board",
  "feature-bundle",
  "presentation",
  "extension",
]);

export function assertValidComponentId(id: string): asserts id is ComponentId {
  if (!ID_RE.test(id)) {
    throw new Error(
      `Invalid component id "${id}". Expected namespace/name (lowercase kebab).`,
    );
  }
}

export function validateManifest(manifest: ComponentManifest): void {
  assertValidComponentId(manifest.id);
  if (!KINDS.has(manifest.kind)) {
    throw new Error(
      `Unsupported component kind "${manifest.kind}" for ${manifest.id}`,
    );
  }
  parseSemVer(manifest.contractVersion);
  if (manifest.schemaVersion < 1) {
    throw new Error(`schemaVersion must be >= 1 for ${manifest.id}`);
  }
  if (!manifest.owner?.trim()) {
    throw new Error(`owner is required for ${manifest.id}`);
  }
  if (!manifest.docs?.summary?.trim()) {
    throw new Error(`docs.summary is required for ${manifest.id}`);
  }
  const life = manifest.lifecycle ?? { state: "active" as const };
  if (
    (life.state === "deprecated" || life.state === "retired") &&
    !life.replacementId &&
    !life.migration
  ) {
    throw new Error(
      `${manifest.id} is ${life.state} but has no replacementId or migration guidance`,
    );
  }
  for (const dep of manifest.dependencies ?? []) {
    assertValidComponentId(dep.id);
    if (dep.id === manifest.id) {
      throw new Error(`Component ${manifest.id} cannot depend on itself`);
    }
  }
}

export function defineComponent(input: {
  manifest: ComponentManifest;
  overrideAllowlist?: string[];
  contribute: (ctx: ComponentFactoryContext) => ComponentContribution;
}): ComponentDefinition {
  validateManifest(input.manifest);
  return {
    manifest: {
      ...input.manifest,
      lifecycle: input.manifest.lifecycle ?? { state: "active" },
      dependencies: input.manifest.dependencies ?? [],
    },
    overrideAllowlist: input.overrideAllowlist ?? [],
    contribute: input.contribute,
  };
}

export function use(
  id: ComponentId,
  range: CompatibilityRange,
  params?: Record<string, unknown>,
  pinReason?: string,
): ComponentRef {
  assertValidComponentId(id);
  if (pinReason === undefined && !range.startsWith("^")) {
    // exact pins without reason are allowed at authoring time but resolve warns;
    // require reason for exact pins per design
    throw new Error(
      `Exact pin for ${id}@${range} requires pinReason (or use ^major)`,
    );
  }
  return { id, range, params, pinReason };
}

export function override(
  componentId: ComponentId,
  fields: Record<string, unknown>,
): VariantOverride {
  assertValidComponentId(componentId);
  return { componentId, fields };
}

export function defineVariant(manifest: VariantManifest): VariantManifest {
  if (!manifest.id?.trim()) {
    throw new Error("Variant id is required");
  }
  if (!manifest.name?.trim()) {
    throw new Error("Variant name is required");
  }
  if (!manifest.components?.length) {
    throw new Error(`Variant ${manifest.id} must select at least one component`);
  }
  for (const ref of manifest.components) {
    assertValidComponentId(ref.id);
  }
  return manifest;
}
