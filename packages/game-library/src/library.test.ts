import { describe, expect, it } from "vitest";
import {
  createCatalog,
  createDefaultCatalog,
  defineComponent,
  defineVariant,
  findConsumers,
  goblinWoodsVariant,
  meadowV1Variant,
  quietGladeVariant,
  resolveVariant,
  use,
  validateManifest,
} from "./index.js";

describe("contracts", () => {
  it("rejects unsupported kinds", () => {
    expect(() =>
      validateManifest({
        id: "core/bad",
        kind: "nope" as "tile",
        schemaVersion: 1,
        contractVersion: "1.0.0",
        owner: "test",
        docs: { summary: "x" },
      }),
    ).toThrow(/Unsupported component kind/);
  });

  it("rejects invalid ids", () => {
    expect(() =>
      defineComponent({
        manifest: {
          id: "BadId",
          kind: "tile",
          schemaVersion: 1,
          contractVersion: "1.0.0",
          owner: "test",
          docs: { summary: "x" },
        },
        contribute: () => ({}),
      }),
    ).toThrow(/Invalid component id/);
  });

  it("rejects missing summary", () => {
    expect(() =>
      defineComponent({
        manifest: {
          id: "core/empty",
          kind: "tile",
          schemaVersion: 1,
          contractVersion: "1.0.0",
          owner: "test",
          docs: { summary: "  " },
        },
        contribute: () => ({}),
      }),
    ).toThrow(/docs.summary/);
  });
});

describe("catalog and graph", () => {
  it("resolves transitive dependencies for goblin woods", () => {
    const catalog = createDefaultCatalog();
    const result = resolveVariant(goblinWoodsVariant, catalog);
    expect(result.definition.id).toBe("goblin-woods");
    expect(result.definition.items?.some((i) => i.id === "sword")).toBe(true);
    expect(result.definition.board.tileTypes.some((t) => t.id === "castle")).toBe(
      true,
    );
    expect(result.resolvedVersions.some((v) => v.id === "items/sword")).toBe(
      true,
    );
  });

  it("detects dependency cycles", () => {
    const a = defineComponent({
      manifest: {
        id: "test/a",
        kind: "item",
        schemaVersion: 1,
        contractVersion: "1.0.0",
        owner: "test",
        dependencies: [{ id: "test/b", range: "^1" }],
        docs: { summary: "a" },
      },
      contribute: () => ({ items: [{ id: "a", label: "A" }] }),
    });
    const b = defineComponent({
      manifest: {
        id: "test/b",
        kind: "item",
        schemaVersion: 1,
        contractVersion: "1.0.0",
        owner: "test",
        dependencies: [{ id: "test/a", range: "^1" }],
        docs: { summary: "b" },
      },
      contribute: () => ({ items: [{ id: "b", label: "B" }] }),
    });
    const catalog = createCatalog([a, b]);
    const variant = defineVariant({
      id: "cycle",
      name: "Cycle",
      components: [use("test/a", "^1")],
    });
    expect(() => resolveVariant(variant, catalog)).toThrow(/cycle/i);
  });

  it("warns on deprecated components", () => {
    const legacy = defineComponent({
      manifest: {
        id: "test/old",
        kind: "item",
        schemaVersion: 1,
        contractVersion: "1.0.0",
        owner: "test",
        lifecycle: {
          state: "deprecated",
          replacementId: "test/new",
          migration: "switch to test/new",
        },
        docs: { summary: "old" },
      },
      contribute: () => ({
        templateId: "tile-board",
        board: {
          grid: { width: 1, height: 1 },
          tileTypes: [{ id: "g", label: "G", color: "#000" }],
          defaultTileTypeId: "g",
        },
        pieceTypes: [{ id: "p", label: "P", color: "#111" }],
        initialPieces: [{ id: "p1", typeId: "p", position: { x: 0, y: 0 } }],
        items: [{ id: "old", label: "Old" }],
      }),
    });
    const catalog = createCatalog([legacy]);
    const variant = defineVariant({
      id: "v",
      name: "V",
      components: [use("test/old", "^1")],
    });
    const result = resolveVariant(variant, catalog);
    expect(result.warnings.some((w) => w.code === "deprecated")).toBe(true);
  });

  it("rejects retired components for unpinned consumers", () => {
    const retired = defineComponent({
      manifest: {
        id: "test/retired",
        kind: "feature-bundle",
        schemaVersion: 1,
        contractVersion: "1.0.0",
        owner: "test",
        lifecycle: { state: "retired", migration: "gone" },
        docs: { summary: "retired" },
      },
      contribute: () => ({
        templateId: "tile-board",
        board: {
          grid: { width: 1, height: 1 },
          tileTypes: [{ id: "g", label: "G", color: "#000" }],
          defaultTileTypeId: "g",
        },
        pieceTypes: [{ id: "p", label: "P", color: "#111" }],
        initialPieces: [{ id: "p1", typeId: "p", position: { x: 0, y: 0 } }],
      }),
    });
    const catalog = createCatalog([retired]);
    const variant = defineVariant({
      id: "v",
      name: "V",
      components: [use("test/retired", "^1")],
    });
    expect(() => resolveVariant(variant, catalog)).toThrow(/Retired/);
  });
});

describe("resolution and propagation", () => {
  it("resolves meadow and quiet-glade from shared core/tile-board", () => {
    const catalog = createDefaultCatalog();
    const meadow = resolveVariant(meadowV1Variant, catalog);
    const quiet = resolveVariant(quietGladeVariant, catalog);
    expect(meadow.definition.templateId).toBe("tile-board");
    expect(quiet.definition.templateId).toBe("tile-board");
    expect(meadow.definition.features?.tileFlip).toBe(true);
    expect(quiet.definition.features?.tileFlip).toBe(false);
    expect(meadow.definition.name).toBe("Meadow v1");
    expect(quiet.definition.name).toBe("Quiet Glade");
  });

  it("propagates compatible core/tile-board updates to both variants", () => {
    const v1 = defineComponent({
      manifest: {
        id: "core/shared-flag",
        kind: "feature-bundle",
        schemaVersion: 1,
        contractVersion: "1.0.0",
        owner: "platform",
        docs: { summary: "shared" },
      },
      contribute: () => ({
        templateId: "tile-board",
        features: { tileFlip: true },
        board: {
          grid: { width: 2, height: 2 },
          tileTypes: [{ id: "g", label: "Grass", color: "#0f0" }],
          defaultTileTypeId: "g",
        },
        pieceTypes: [{ id: "p", label: "P", color: "#f00" }],
        initialPieces: [{ id: "p1", typeId: "p", position: { x: 0, y: 0 } }],
      }),
    });
    const catalog = createCatalog([v1]);
    const a = defineVariant({
      id: "a",
      name: "A",
      components: [use("core/shared-flag", "^1")],
    });
    const b = defineVariant({
      id: "b",
      name: "B",
      components: [use("core/shared-flag", "^1")],
    });
    expect(resolveVariant(a, catalog).definition.board.tileTypes[0].label).toBe(
      "Grass",
    );

    // Simulate compatible update by replacing catalog entry via new catalog
    const v1b = defineComponent({
      manifest: {
        id: "core/shared-flag",
        kind: "feature-bundle",
        schemaVersion: 1,
        contractVersion: "1.0.1",
        owner: "platform",
        docs: { summary: "shared" },
      },
      contribute: () => ({
        templateId: "tile-board",
        features: { tileFlip: true },
        board: {
          grid: { width: 2, height: 2 },
          tileTypes: [{ id: "g", label: "Lawn", color: "#0f0" }],
          defaultTileTypeId: "g",
        },
        pieceTypes: [{ id: "p", label: "P", color: "#f00" }],
        initialPieces: [{ id: "p1", typeId: "p", position: { x: 0, y: 0 } }],
      }),
    });
    // Same major — createCatalog won't allow duplicate major; build manually
    const catalog2 = createCatalog([]);
    catalog2.entries.set("core/shared-flag@1", v1b);

    expect(resolveVariant(a, catalog2).definition.board.tileTypes[0].label).toBe(
      "Lawn",
    );
    expect(resolveVariant(b, catalog2).definition.board.tileTypes[0].label).toBe(
      "Lawn",
    );
  });

  it("keeps exact pins on retained majors across breaking releases", () => {
    const major1 = defineComponent({
      manifest: {
        id: "core/breaking",
        kind: "feature-bundle",
        schemaVersion: 1,
        contractVersion: "1.0.0",
        owner: "platform",
        docs: { summary: "v1" },
      },
      contribute: () => ({
        templateId: "tile-board",
        board: {
          grid: { width: 1, height: 1 },
          tileTypes: [{ id: "g", label: "V1", color: "#000" }],
          defaultTileTypeId: "g",
        },
        pieceTypes: [{ id: "p", label: "P", color: "#111" }],
        initialPieces: [{ id: "p1", typeId: "p", position: { x: 0, y: 0 } }],
      }),
    });
    const major2 = defineComponent({
      manifest: {
        id: "core/breaking",
        kind: "feature-bundle",
        schemaVersion: 1,
        contractVersion: "2.0.0",
        owner: "platform",
        docs: { summary: "v2" },
      },
      contribute: () => ({
        templateId: "tile-board",
        board: {
          grid: { width: 1, height: 1 },
          tileTypes: [{ id: "g", label: "V2", color: "#000" }],
          defaultTileTypeId: "g",
        },
        pieceTypes: [{ id: "p", label: "P", color: "#111" }],
        initialPieces: [{ id: "p1", typeId: "p", position: { x: 0, y: 0 } }],
      }),
    });
    const catalog = createCatalog([major1, major2]);
    const pinned = defineVariant({
      id: "pinned",
      name: "Pinned",
      components: [use("core/breaking", "1.0.0", undefined, "experiment")],
    });
    const latest = defineVariant({
      id: "latest",
      name: "Latest",
      components: [use("core/breaking", "^2")],
    });
    expect(
      resolveVariant(pinned, catalog).definition.board.tileTypes[0].label,
    ).toBe("V1");
    expect(
      resolveVariant(latest, catalog).definition.board.tileTypes[0].label,
    ).toBe("V2");
    expect(() =>
      resolveVariant(
        defineVariant({
          id: "bad",
          name: "Bad",
          components: [use("core/breaking", "^1")],
        }),
        // only major 2 registered under a filtered catalog? both exist; ^1 still works
        createCatalog([major2]),
      ),
    ).toThrow(/No version/);
  });

  it("lists consumers of core/tile-board", () => {
    const catalog = createDefaultCatalog();
    const consumers = findConsumers(catalog, "core/tile-board", [
      meadowV1Variant,
      quietGladeVariant,
      goblinWoodsVariant,
    ]);
    expect(consumers).toEqual(["goblin-woods", "meadow-v1", "quiet-glade"]);
  });

  it("rejects unknown override fields", () => {
    const catalog = createDefaultCatalog();
    const variant = defineVariant({
      id: "meadow-v1",
      name: "Meadow v1",
      components: [
        use("core/tile-board", "^1"),
        use("boards/meadow-v1", "^1"),
        use("pieces/meadow-v1", "^1"),
      ],
      overrides: [{ componentId: "pieces/meadow-v1", fields: { attack: 9 } }],
    });
    expect(() => resolveVariant(variant, catalog)).toThrow(/not allowlisted/);
  });

  it("preserves goblin woods gameplay anchors", () => {
    const catalog = createDefaultCatalog();
    const def = resolveVariant(goblinWoodsVariant, catalog).definition;
    expect(def.run?.startPosition).toEqual({ x: 3, y: 6 });
    expect(def.board.overrides?.some((o) => o.typeId === "mage")).toBe(true);
    expect(
      def.board.tileTypes.find((t) => t.id === "pit")?.passItemId,
    ).toBe("makeshift-bridge");
    expect(
      def.board.tileTypes.find((t) => t.id === "castle")?.passItemId,
    ).toBe("sledgehammer");
    expect(def.board.tileTypes.some((t) => t.id === "sword-cache")).toBe(false);
    expect(def.items?.some((i) => i.id === "sledgehammer" && i.breaksSideWalls)).toBe(
      true,
    );
  });
});
