import type { Catalog, VariantManifest } from "./types.js";
import { resolveVariant } from "./resolve.js";

export type CheckResult = {
  ok: boolean;
  errors: string[];
  warnings: string[];
};

export function validateCatalog(catalog: Catalog): CheckResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  for (const component of catalog.list()) {
    const m = component.manifest;
    for (const dep of m.dependencies ?? []) {
      if (!catalog.get(dep.id)) {
        errors.push(`${m.id} depends on missing ${dep.id}`);
      }
    }
  }
  return { ok: errors.length === 0, errors, warnings };
}

export function validateVariants(
  catalog: Catalog,
  variants: VariantManifest[],
): CheckResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const catalogCheck = validateCatalog(catalog);
  errors.push(...catalogCheck.errors);
  warnings.push(...catalogCheck.warnings);

  for (const variant of variants) {
    try {
      const result = resolveVariant(variant, catalog);
      for (const w of result.warnings) {
        warnings.push(`${variant.id}: ${w.message}`);
      }
    } catch (err) {
      errors.push(
        `${variant.id}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }
  return { ok: errors.length === 0, errors, warnings };
}
