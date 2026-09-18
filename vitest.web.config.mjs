import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const repoRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  cacheDir: path.join(repoRoot, "node_modules/.vite-web-test"),
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@game-maker/engine": path.join(repoRoot, "packages/engine/src/index.ts"),
    },
  },
});
