import { defineConfig } from "@tanstack/start/config";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
  vite: {
    plugins: [wasm(), topLevelAwait()],
  },
});
