import type { GameDefinition } from "@game-maker/engine";
import type { PrototypeExtensions } from "../../../../prototypes/_shared/extensions";
import { meadowV1 } from "../../../../prototypes/meadow-v1/config/game.config";
import meadowExtensions from "../../../../prototypes/meadow-v1/extensions";
import { quietGlade } from "../../../../prototypes/quiet-glade/config/game.config";
import quietGladeExtensions from "../../../../prototypes/quiet-glade/extensions";

export type RegisteredPrototype = {
  definition: GameDefinition;
  extensions: PrototypeExtensions;
};

/**
 * Explicit registry so Vite can statically resolve prototype modules.
 * When scaffolding a new prototype, add an entry here.
 */
export const prototypeRegistry: Record<string, RegisteredPrototype> = {
  "meadow-v1": {
    definition: meadowV1,
    extensions: meadowExtensions,
  },
  "quiet-glade": {
    definition: quietGlade,
    extensions: quietGladeExtensions,
  },
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
