import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import path from "path";
import fs from "fs";

function serveContentDocs(): Plugin {
  const docsDir = path.resolve(__dirname, "../content/docs");
  return {
    name: "serve-content-docs",
    configureServer(server) {
      server.middlewares.use("/docs", (req, res, next) => {
        const filePath = path.join(docsDir, req.url ?? "");
        const resolved = path.resolve(filePath);
        if (!resolved.startsWith(docsDir)) {
          res.statusCode = 403;
          res.end("Forbidden");
          return;
        }
        if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) {
          res.setHeader("Content-Type", "text/markdown; charset=utf-8");
          fs.createReadStream(resolved).pipe(res);
        } else {
          next();
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), wasm(), topLevelAwait(), serveContentDocs()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
