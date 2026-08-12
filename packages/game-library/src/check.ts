import { execSync } from "node:child_process";
import type { Catalog, VariantManifest } from "./types.js";
import { findConsumers, resolveVariant } from "./resolve.js";
import { validateVariants } from "./validate.js";

function changedFiles(): string[] {
  try {
    const out = execSync("git diff --name-only HEAD", {
      encoding: "utf8",
    });
    const staged = execSync("git diff --name-only --cached", {
      encoding: "utf8",
    });
    return [...new Set(`${out}\n${staged}`.split("\n").filter(Boolean))];
  } catch {
    return [];
  }
}

export function componentIdsFromPaths(paths: string[]): string[] {
  const ids = new Set<string>();
  for (const path of paths) {
    if (path.includes("components/items/goblin-woods")) {
      for (const id of [
        "items/sword",
        "items/shield",
        "items/makeshift-bridge",
        "items/rope-bridge",
        "items/machete",
        "items/knife",
        "items/spear",
        "items/charm",
        "items/sneak",
        "items/sledgehammer",
      ]) {
        ids.add(id);
      }
      continue;
    }
    if (path.includes("components/boards/meadow-v1")) {
      ids.add("boards/meadow-v1");
      ids.add("pieces/meadow-v1");
      continue;
    }
    if (path.includes("components/boards/quiet-glade")) {
      ids.add("boards/quiet-glade");
      ids.add("pieces/quiet-glade");
      continue;
    }
    if (path.includes("components/core/tile-board")) {
      ids.add("core/tile-board");
      continue;
    }
    if (path.includes("components/boards/goblin-woods")) {
      ids.add("boards/goblin-woods");
      continue;
    }
    if (path.includes("components/rules/programmed-run")) {
      ids.add("rules/programmed-run");
      continue;
    }
    const match = path.match(
      /packages\/game-library\/src\/components\/([^/]+)\/([^/.]+)/,
    );
    if (match) {
      ids.add(`${match[1]}/${match[2]}`);
    }
  }
  return [...ids];
}

export function checkFull(catalog: Catalog, variants: VariantManifest[]) {
  return validateVariants(catalog, variants);
}

export function checkChanged(
  catalog: Catalog,
  variants: VariantManifest[],
  paths: string[] = changedFiles(),
) {
  const changedComponents = componentIdsFromPaths(paths);
  if (changedComponents.length === 0) {
    const full = checkFull(catalog, variants);
    return {
      ...full,
      changedComponents: [] as string[],
      affectedVariants: variants.map((v) => v.id),
    };
  }

  const affected = new Set<string>();
  for (const id of changedComponents) {
    for (const consumer of findConsumers(catalog, id, variants)) {
      affected.add(consumer);
    }
  }

  const errors: string[] = [];
  const warnings: string[] = [];
  for (const variant of variants.filter((v) => affected.has(v.id))) {
    try {
      const resolved = resolveVariant(variant, catalog);
      warnings.push(
        ...resolved.warnings.map((w) => `${variant.id}: ${w.message}`),
      );
    } catch (err) {
      errors.push(
        `${variant.id}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    changedComponents,
    affectedVariants: [...affected].sort(),
  };
}
