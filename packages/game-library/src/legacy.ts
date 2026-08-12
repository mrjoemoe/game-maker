import type { GameDefinition } from "@game-maker/engine";
import type { Catalog, ResolveResult, VariantManifest } from "./types.js";
import { resolveVariant } from "./resolve.js";

/**
 * Wraps a monolithic GameDefinition as a temporary resolved variant.
 * Emits a migration warning — preferred path is a composition manifest.
 */
export function legacyDefinitionAdapter(
  definition: GameDefinition,
  extensions: { banner?: string; rulebook?: string } = {},
): ResolveResult {
  return {
    definition,
    extensions,
    provenance: {
      "legacy.definition": {
        componentId: `legacy/${definition.id}` as `${string}/${string}`,
        contractVersion: "0.0.0",
      },
    },
    warnings: [
      {
        code: "legacy-adapter",
        message: `Prototype "${definition.id}" still uses a monolithic GameDefinition. Migrate to a composition manifest.`,
      },
    ],
    resolvedVersions: [],
    dependencyGraph: [],
  };
}

export type RegisteredSource =
  | { kind: "variant"; manifest: VariantManifest }
  | { kind: "legacy"; definition: GameDefinition; extensions?: { banner?: string; rulebook?: string } };

export function resolveRegistered(
  source: RegisteredSource,
  catalog: Catalog,
): ResolveResult {
  if (source.kind === "legacy") {
    return legacyDefinitionAdapter(source.definition, source.extensions);
  }
  return resolveVariant(source.manifest, catalog);
}
