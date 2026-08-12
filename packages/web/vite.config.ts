import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@game-maker/engine": path.resolve(__dirname, "../engine/src/index.ts"),
      "@game-maker/game-library": path.resolve(
        __dirname,
        "../game-library/src/index.ts",
      ),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});
