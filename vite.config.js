import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import imgVariants from "./scripts/vite-plugin-img.mjs";

/**
 * `vite preview` rāda dist/ tāpat kā hostings: /bistro -> dist/bistro/index.html
 * (prerender rezultāts), nevis vienmēr dist/index.html. Netlify un
 * Cloudflare Pages to dara paši; šeit tas vajadzīgs tikai pārbaudei.
 */
function previewPrerendered() {
  return {
    name: "silva-preview-prerendered",
    configurePreviewServer(server) {
      const dist = path.resolve(server.config.root, server.config.build.outDir);
      server.middlewares.use((req, res, next) => {
        const url = (req.url || "/").split("?")[0];
        if (url !== "/" && !path.extname(url)) {
          const file = path.join(dist, url.replace(/\/$/, ""), "index.html");
          if (fs.existsSync(file)) {
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.end(fs.readFileSync(file));
            return;
          }
          const notFound = path.join(dist, "404.html");
          if (fs.existsSync(notFound)) {
            res.statusCode = 404;
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.end(fs.readFileSync(notFound));
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), imgVariants(), previewPrerendered()],
});
