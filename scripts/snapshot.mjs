/* ---------------------------------------------------------------
   Pirms būves: paņem adminā (Django) mainītos iestatījumus un ieraksta
   tos src/data/:
     /theme.json   -> theme.json    (fonti)
     /notices.json -> notices.json  ("aktuāli" rāmju Instagram ieraksti)
   Ja serveris nav sasniedzams vai atbilde nav derīga — atstāj esošo
   failu un turpina (būve nekad neapstājas).

   Adrese: SNAPSHOT_API (noklusējums — PythonAnywhere tieši, ne caur Netlify).
   Izlaist: SKIP_SNAPSHOT=1
   --------------------------------------------------------------- */

import fs from "node:fs";
import path from "node:path";
import { validateTheme, root } from "./theme.mjs";

const API = (process.env.SNAPSHOT_API || "https://opscury.eu.pythonanywhere.com").replace(/\/$/, "");

const INSTAGRAM = /^https:\/\/www\.instagram\.com\/(p|reel|tv)\/[A-Za-z0-9_-]{5,40}\/$/;
const PAGES = ["bistro", "konditoreja", "tejas-namins"];

export function validateNotices(n) {
  if (!n || typeof n !== "object" || !n.pages || typeof n.pages !== "object") throw new Error("nav 'pages'");
  for (const [page, v] of Object.entries(n.pages)) {
    if (!PAGES.includes(page)) throw new Error(`nezināma lapa '${page}'`);
    if (!INSTAGRAM.test(v.instagram)) throw new Error(`${page}: slikta Instagram adrese`);
    if (typeof v.captioned !== "boolean") throw new Error(`${page}: captioned nav true/false`);
  }
  return n;
}

const SOURCES = [
  {
    path: "/theme.json",
    file: "theme.json",
    validate: validateTheme,
    describe: (t) =>
      `${t.fonts.head.family} / ${t.fonts.body.family} / ${t.fonts.mono.family}, virsraksti ${t.headingWeight}`,
  },
  {
    path: "/notices.json",
    file: "notices.json",
    validate: validateNotices,
    describe: (n) =>
      Object.entries(n.pages).map(([p, v]) => `${p}: ${v.instagram}`).join(", ") || "bez Instagram ierakstiem",
  },
];

async function snapshot({ path: urlPath, file, validate, describe }) {
  const target = path.join(root, "src", "data", file);
  try {
    const res = await fetch(`${API}${urlPath}`, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = validate(await res.json());
    const next = JSON.stringify(data, null, 2) + "\n";
    const prev = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : "";
    if (next !== prev) fs.writeFileSync(target, next);
    console.log(`[snapshot] ${file}: ${describe(data)}${next === prev ? " (bez izmaiņām)" : " (atjaunots)"}`);
  } catch (err) {
    console.warn(`[snapshot] ${API}${urlPath} neizdevās (${err.message}) — lieto esošo ${file}`);
  }
}

if (process.env.SKIP_SNAPSHOT === "1") {
  console.log("[snapshot] SKIP_SNAPSHOT=1 — lieto esošos src/data failus");
} else {
  await Promise.all(SOURCES.map(snapshot));
}
