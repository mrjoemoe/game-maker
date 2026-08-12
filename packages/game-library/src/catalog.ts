import type { Catalog, ComponentDefinition, ComponentId } from "./types.js";
import { catalogKey, majorOf } from "./versions.js";
import { validateManifest } from "./authoring.js";

export function createCatalog(
  components: ComponentDefinition[] = [],
): Catalog {
  const entries = new Map<string, ComponentDefinition>();

  const catalog: Catalog = {
    entries,
    list() {
      return [...entries.values()].sort((a, b) =>
        a.manifest.id.localeCompare(b.manifest.id),
      );
    },
    get(id: ComponentId, major?: number) {
      if (major !== undefined) {
        return entries.get(catalogKey(id, major));
      }
      const matches = [...entries.values()].filter((c) => c.manifest.id === id);
      if (matches.length === 0) return undefined;
      return matches.sort((a, b) =>
        b.manifest.contractVersion.localeCompare(a.manifest.contractVersion),
      )[0];
    },
    register(component: ComponentDefinition) {
      validateManifest(component.manifest);
      const major = majorOf(component.manifest.contractVersion);
      const key = catalogKey(component.manifest.id, major);
      if (entries.has(key)) {
        throw new Error(`Duplicate catalog entry: ${key}`);
      }
      entries.set(key, component);
    },
  };

  for (const component of components) {
    catalog.register(component);
  }
  return catalog;
}

export function searchCatalog(
  catalog: Catalog,
  query: string,
): ComponentDefinition[] {
  const q = query.trim().toLowerCase();
  if (!q) return catalog.list();
  return catalog.list().filter((c) => {
    const m = c.manifest;
    return (
      m.id.includes(q) ||
      m.kind.includes(q) ||
      m.docs.summary.toLowerCase().includes(q) ||
      m.owner.toLowerCase().includes(q)
    );
  });
}
