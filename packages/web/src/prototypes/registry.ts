import type { GameDefinition } from "@game-maker/engine";
import {
  createDefaultCatalog,
  legacyDefinitionAdapter,
  resolveVariant,
  type ResolveResult,
  type VariantManifest,
} from "@game-maker/game-library";
import type { PrototypeExtensions } from "../../../../prototypes/_shared/extensions";
import {
  meadowV1,
  meadowV1Manifest,
} from "../../../../prototypes/meadow-v1/config/game.config";
import meadowExtensions from "../../../../prototypes/meadow-v1/extensions";
import {
  quietGlade,
  quietGladeManifest,
} from "../../../../prototypes/quiet-glade/config/game.config";
import quietGladeExtensions from "../../../../prototypes/quiet-glade/extensions";
import {
  goblinWoods,
  goblinWoodsManifest,
} from "../../../../prototypes/goblin-woods/config/game.config";
import goblinWoodsExtensions from "../../../../prototypes/goblin-woods/extensions";

export type RegisteredPrototype = {
  definition: GameDefinition;
  extensions: PrototypeExtensions;
  /** Present when the prototype is composed from the component library. */
  manifest?: VariantManifest;
  resolveWarnings?: ResolveResult["warnings"];
};

const catalog = createDefaultCatalog();

function fromManifest(
  manifest: VariantManifest,
  extensions: PrototypeExtensions,
): RegisteredPrototype {
  const resolved = resolveVariant(manifest, catalog);
  return {
    definition: resolved.definition,
    extensions: {
      ...extensions,
      banner: extensions.banner ?? resolved.extensions.banner,
      rulebook: extensions.rulebook ?? resolved.extensions.rulebook,
    },
    manifest,
    resolveWarnings: resolved.warnings,
  };
}

/**
 * Explicit registry so Vite can statically resolve prototype modules.
 * Prefer composition manifests; legacy adapters remain available for migration.
 */
export const prototypeRegistry: Record<string, RegisteredPrototype> = {
  "meadow-v1": fromManifest(meadowV1Manifest, meadowExtensions),
  "quiet-glade": fromManifest(quietGladeManifest, quietGladeExtensions),
  "goblin-woods": fromManifest(goblinWoodsManifest, goblinWoodsExtensions),
};

export const DEFAULT_PROTOTYPE_ID = "meadow-v1";

export function resolvePrototype(id: string | undefined): RegisteredPrototype {
  const key = id && id.length > 0 ? id : DEFAULT_PROTOTYPE_ID;
  const entry = prototypeRegistry[key];
  if (!entry) {
    const known = Object.keys(prototypeRegistry).join(", ");
    throw new Error(`Unknown prototype "${key}". Known: ${known}`);
  }
  return entry;
}

/** Escape hatch for tests / migration. */
export function registerLegacyPrototype(
  definition: GameDefinition,
  extensions: PrototypeExtensions = {},
): RegisteredPrototype {
  const adapted = legacyDefinitionAdapter(definition, extensions);
  return {
    definition: adapted.definition,
    extensions,
    resolveWarnings: adapted.warnings,
  };
}

// Keep named exports reachable for static analysis / parity checks.
void meadowV1;
void quietGlade;
void goblinWoods;
