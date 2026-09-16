/* ---------------------------------------------------------------
   Statiskais HTML katram ceļam.

   `npm run build` vispirms būvē pārlūka versiju (dist/), tad servera
   versiju (dist/server/), un šis skripts katram ceļam no data/meta.js
   uzraksta dist/<ceļš>/index.html ar gatavu saturu, pareizu <title>,
   aprakstu, og: tagiem un kanonisko saiti. Pēc tam pārlūkā React to
   pārņem (hydrate). Rezultāts: meklētāji un saišu priekšskatījumi redz
   īstu lapu, nevis tukšu <div id="root">.

   Papildus: dist/404.html un dist/sitemap.xml.
   --------------------------------------------------------------- */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const serverDir = path.join(dist, "server");

const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const { render, routesMeta, SITE_URL } = await import(
  pathToFileURL(path.join(serverDir, "entry-server.js")).href
);

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

function headFor(route, meta) {
  const url = `${SITE_URL}${route === "/" ? "/" : route}`;
  return [
    `<meta property="og:image" content="${SITE_URL}${meta.og}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<link rel="canonical" href="${esc(url)}" />`,
    meta.noindex ? `<meta name="robots" content="noindex" />` : "",
  ]
    .filter(Boolean)
    .join("\n    ");
}

function pageHtml(route, meta) {
  const app = render(route === "/404" ? "/__nav__/nav-atrasta" : route);
  let html = template;
  // nomaina noklusēto <title>, aprakstu, og:title/description/image/url un canonical
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(meta.title)}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${esc(meta.description)}" />`
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*" \/>/,
    `<meta property="og:title" content="${esc(meta.title)}" />`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*" \/>/,
    `<meta property="og:description" content="${esc(meta.description)}" />`
  );
  html = html.replace(/<meta property="og:image" content="[^"]*" \/>\n?\s*/, "");
  html = html.replace(/<meta property="og:url" content="[^"]*" \/>\n?\s*/, "");
  html = html.replace(/<link rel="canonical" href="[^"]*" \/>\n?\s*/, "");
  html = html.replace("<!--app-head-->", headFor(route, meta));
  html = html.replace("<!--app-html-->", app);
  return html;
}

let written = 0;
for (const [route, meta] of Object.entries(routesMeta)) {
  const html = pageHtml(route, meta);
  const file =
    route === "/"
      ? path.join(dist, "index.html")
      : route === "/404"
        ? path.join(dist, "404.html")
        : path.join(dist, route.slice(1), "index.html");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  written++;
}

// sitemap — tikai indeksējamie ceļi
const today = new Date().toISOString().slice(0, 10);
const urls = Object.entries(routesMeta)
  .filter(([, m]) => !m.noindex)
  .map(
    ([route]) =>
      `  <url><loc>${SITE_URL}${route === "/" ? "/" : route}</loc><lastmod>${today}</lastmod></url>`
  )
  .join("\n");
fs.writeFileSync(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
);

fs.rmSync(serverDir, { recursive: true, force: true });
console.log(`[prerender] ${written} lapas, sitemap.xml`);
