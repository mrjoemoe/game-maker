import { describe, expect, it } from "vitest";
import {
  createDefaultCatalog,
  goblinWoodsVariant,
  meadowV1Variant,
  quietGladeVariant,
  resolveVariant,
} from "@game-maker/game-library";

/**
 * Guard: every active prototype must resolve from a composition manifest.
 * Monolithic GameDefinition-only registration is rejected by convention.
 */
describe("composed registry contract", () => {
  it("resolves all active variants from manifests", () => {
    const catalog = createDefaultCatalog();
    for (const manifest of [
      meadowV1Variant,
      quietGladeVariant,
      goblinWoodsVariant,
    ]) {
      const resolved = resolveVariant(manifest, catalog);
      expect(resolved.definition.id).toBe(manifest.id);
      expect(resolved.resolvedVersions.length).toBeGreaterThan(0);
      expect(manifest.components.length).toBeGreaterThan(0);
    }
  });

  it("does not use exact pins without documented reasons on builtins", () => {
    for (const manifest of [
      meadowV1Variant,
      quietGladeVariant,
      goblinWoodsVariant,
    ]) {
      for (const ref of manifest.components) {
        expect(ref.range.startsWith("^")).toBe(true);
      }
    }
  });
});
