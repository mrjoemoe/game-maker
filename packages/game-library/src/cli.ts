#!/usr/bin/env node
import { createDefaultCatalog } from "./components/index.js";
import { searchCatalog } from "./catalog.js";
import { checkChanged, checkFull } from "./check.js";
import { findConsumers, resolveVariant } from "./resolve.js";
import {
  goblinWoodsVariant,
  meadowV1Variant,
  quietGladeVariant,
} from "./variants/builtins.js";

const catalog = createDefaultCatalog();
const variants = [meadowV1Variant, quietGladeVariant, goblinWoodsVariant];

function printHelp(): void {
  console.log(`game — game-component library tooling

Usage:
  game catalog list|show <id>|search <query>
  game variant create <id>|resolve <id>|graph <id>
  game component create <id>|consumers <id>|deprecate
  game check [--changed]
`);
}

function main(argv: string[]): number {
  const [cmd, sub, ...rest] = argv;

  if (!cmd || cmd === "help" || cmd === "--help") {
    printHelp();
    return 0;
  }

  if (cmd === "catalog") {
    if (sub === "list") {
      for (const c of catalog.list()) {
        const life = c.manifest.lifecycle?.state ?? "active";
        console.log(
          `${c.manifest.id}@${c.manifest.contractVersion} [${c.manifest.kind}] (${life}) — ${c.manifest.docs.summary}`,
        );
      }
      return 0;
    }
    if (sub === "show") {
      const id = rest[0];
      const c = catalog.get(id!);
      if (!c) {
        console.error(`Unknown component ${id}`);
        return 1;
      }
      console.log(JSON.stringify(c.manifest, null, 2));
      return 0;
    }
    if (sub === "search") {
      const q = rest.join(" ");
      for (const c of searchCatalog(catalog, q)) {
        console.log(`${c.manifest.id} — ${c.manifest.docs.summary}`);
      }
      return 0;
    }
  }

  if (cmd === "variant") {
    if (sub === "create") {
      const id = rest[0];
      if (!id) {
        console.error("variant create <id>");
        return 1;
      }
      console.log(`Scaffold composition for prototypes/${id}:

import { defineVariant, use, createDefaultCatalog, resolveVariant } from "@game-maker/game-library";

export const ${id.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())}Variant = defineVariant({
  id: "${id}",
  name: "${id}",
  components: [
    use("core/tile-board", "^1"),
    // use("boards/...", "^1"),
  ],
});

export default resolveVariant(${id.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())}Variant, createDefaultCatalog()).definition;
`);
      return 0;
    }
    const id = rest[0] ?? sub;
    const action = sub === "resolve" || sub === "graph" ? sub : undefined;
    const variantId = action ? rest[0] : sub;
    const variant = variants.find((v) => v.id === variantId);
    if (!variant) {
      console.error(`Unknown variant ${variantId}`);
      return 1;
    }
    if (action === "graph" || sub === "graph") {
      const result = resolveVariant(variant, catalog);
      for (const edge of result.dependencyGraph) {
        console.log(`${edge.from} -> ${edge.to}`);
      }
      return 0;
    }
    const result = resolveVariant(variant, catalog);
    console.log(
      JSON.stringify(
        {
          id: result.definition.id,
          name: result.definition.name,
          resolvedVersions: result.resolvedVersions,
          warnings: result.warnings,
          provenanceKeys: Object.keys(result.provenance).length,
        },
        null,
        2,
      ),
    );
    return 0;
  }

  if (cmd === "component") {
    if (sub === "create") {
      const id = rest[0];
      if (!id || !id.includes("/")) {
        console.error("component create <namespace/name>");
        return 1;
      }
      console.log(`Add defineComponent for ${id} under packages/game-library/src/components/, register in components/index.ts, add tests, then:
  npm run game -- component consumers ${id}
  npm run game:check:changed
`);
      return 0;
    }
    if (sub === "consumers") {
      const id = rest[0];
      if (!id) {
        console.error("component consumers <id>");
        return 1;
      }
      for (const consumer of findConsumers(catalog, id, variants)) {
        console.log(consumer);
      }
      return 0;
    }
    if (sub === "deprecate") {
      console.log(
        "Set manifest.lifecycle = { state: 'deprecated', replacementId, migration } and bump docs; keep major resolvable until consumers migrate.",
      );
      return 0;
    }
  }
  if (cmd === "check") {
    const changed = sub === "--changed" || rest.includes("--changed");
    if (changed) {
      const result = checkChanged(catalog, variants);
      console.log(
        `changed: ${result.changedComponents.join(", ") || "(none)"}`,
      );
      console.log(`affected: ${result.affectedVariants.join(", ")}`);
      for (const w of result.warnings) console.warn(`warn: ${w}`);
      for (const e of result.errors) console.error(`error: ${e}`);
      console.log(result.ok ? "ok" : "failed");
      return result.ok ? 0 : 1;
    }
    const result = checkFull(catalog, variants);
    for (const w of result.warnings) console.warn(`warn: ${w}`);
    for (const e of result.errors) console.error(`error: ${e}`);
    console.log(result.ok ? "ok" : "failed");
    return result.ok ? 0 : 1;
  }

  printHelp();
  return 1;
}

const code = main(process.argv.slice(2));
process.exit(code);
