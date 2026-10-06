import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import imgVariants from "./scripts/vite-plugin-img.mjs";
import theme from "./scripts/vite-plugin-theme.mjs";

/**
 * `vite preview` rāda dist/ tāpat kā hostings: /bistro -> dist/bistro.html
 * (prerender rezultāts), nevis vienmēr dist/index.html. Netlify un
 * Cloudflare Pages to dara paši; šeit tas vajadzīgs tikai pārbaudei.
 */
// Ceļi, kas iet uz Django (skat. proxy zemāk) — tos neapkalpo no dist/.
const PROXIED = ["/api", "/media", "/admin", "/static"];

function previewPrerendered() {
  return {
    name: "silva-preview-prerendered",
    configurePreviewServer(server) {
      const dist = path.resolve(server.config.root, server.config.build.outDir);
      server.middlewares.use((req, res, next) => {
        const url = (req.url || "/").split("?")[0];
        const proxied = PROXIED.some((p) => url === p || url.startsWith(`${p}/`));
        if (url !== "/" && !path.extname(url) && !proxied) {
          const file = path.join(dist, `${url.replace(/\/$/, "")}.html`);
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

// Izstrādē (npm run dev / preview) /api, /media, /admin un /static iet uz
// lokālo Django (silva-api: python manage.py runserver) — tāpat kā Netlify
// tos pārsūta uz PythonAnywhere. Cits serveris: API_PROXY=https://… npm run dev
const API_PROXY = process.env.API_PROXY || "http://127.0.0.1:8000";
const proxy = Object.fromEntries(PROXIED.map((p) => [p, { target: API_PROXY, changeOrigin: true }]));

export default defineConfig({
  plugins: [react(), imgVariants(), theme(), previewPrerendered()],
  server: { proxy },
  preview: { proxy },
});
