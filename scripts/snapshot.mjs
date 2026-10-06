/* ---------------------------------------------------------------
   Satura momentuzņēmums pirms būves.

   Paņem no Silvas admin API (Django, PythonAnywhere) šībrīža saturu
   un pārraksta src/data/ failus, no kuriem būvē statisko HTML:

     /api/site/        -> lines.json   (uzņēmums, vietas, darba laiki, pasākumu vietas)
                       -> content.json (teksti, foto, galerijas, aktualitātes, nomas cenas)
     /api/konditoreja/ -> konditoreja.json
     /api/theme/       -> theme.json   (fonti; tos iebūvē, tāpēc maiņai vajag jaunu būvi)

   Pārlūkā lapa pēc tam pati pieprasa jaunākos datus (src/lib/content.jsx),
   tāpēc momentuzņēmums ir tikai pirmā ielāde un tas, ko redz Google.

   Nekad neaptur būvi: ja API nav pieejams vai atbild dīvaini, faili
   paliek kā bija, tiek izdrukāts brīdinājums, iziet ar 0.

     SNAPSHOT_API=https://opscury.eu.pythonanywhere.com  (noklusējums)
     SNAPSHOT_API=http://127.0.0.1:8000 node scripts/snapshot.mjs
   --------------------------------------------------------------- */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validKonditoreja, validSite } from "../src/lib/contentShape.js";
import { validateTheme } from "./theme.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "src", "data");
const API = (process.env.SNAPSHOT_API || "https://opscury.eu.pythonanywhere.com").replace(/\/+$/, "");
const TIMEOUT_MS = Number(process.env.SNAPSHOT_TIMEOUT_MS || 20000);

async function getJson(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

function write(name, data) {
  const file = path.join(dataDir, name);
  const next = `${JSON.stringify(data, null, 2)}\n`;
  const prev = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
  if (prev === next) return false;
  fs.writeFileSync(file, next);
  return true;
}

try {
  const [site, konditoreja] = await Promise.all([
    getJson(`${API}/api/site/`),
    getJson(`${API}/api/konditoreja/`),
  ]);
  if (!validSite(site)) throw new Error("/api/site/ forma neizskatās pareiza");
  if (!validKonditoreja(konditoreja)) throw new Error("/api/konditoreja/ forma neizskatās pareiza");

  const { company, lines, venues, ...content } = site;
  const changed = [
    write("lines.json", { company, lines, venues }) && "lines.json",
    write("content.json", content) && "content.json",
    write("konditoreja.json", konditoreja) && "konditoreja.json",
  ].filter(Boolean);
  const items = konditoreja.categories.reduce((n, c) => n + c.items.length, 0);
  console.log(
    `[snapshot] ${API}: ${lines.length} vietas, ${Object.keys(content.texts).length} teksti, ` +
      `${Object.keys(content.galleries).length} galerijas, ${items} preces — ` +
      (changed.length ? `atjaunots ${changed.join(", ")}` : "bez izmaiņām")
  );
} catch (err) {
  console.warn(`[snapshot] Brīdinājums: ${err.message || err}. Būvēju ar esošajiem src/data failiem.`);
}

// Fonti atsevišķi: ja šis neizdodas, saturs tik un tā ir atjaunots (un otrādi).
try {
  const theme = validateTheme(await getJson(`${API}/api/theme/`));
  const f = theme.fonts;
  console.log(
    `[snapshot] fonti: ${f.head.family} / ${f.body.family} / ${f.mono.family}, virsraksti ${theme.headingWeight}` +
      (write("theme.json", theme) ? " — atjaunots theme.json" : " — bez izmaiņām")
  );
} catch (err) {
  console.warn(`[snapshot] Fonti: ${err.message || err}. Lietoju esošo theme.json.`);
}
process.exit(0);
