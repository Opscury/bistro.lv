/* ---------------------------------------------------------------
   Nedēļas ēdienkarte no PDF -> src/data/menu.json (lunch) + PDF kopija
   public/menu/pusdienas.pdf.

     npm run menu -- "C:\…\Bistro-edienkarte-15.09.-21.09.pdf"
     npm run menu -- fails.pdf --no 2026-09-15 --lidz 2026-09-21

   Lasa PDF tekstu (pdfjs), saliek rindas pēc augstuma un atpazīst:
     - virsrakstus: rinda bez cenas, piem. "Pankūkas (€/gab.)"
     - grupas: rinda ar kolu galā, piem. "Dienas zupas:"
     - ēdienus: "nosaukums [svars] cena", pārnesumi ar mazo burtu
     - "Veselīgāku ēdienu izlase" lapas -> healthy: true atbilstošajiem
   Derīguma datumus ņem no faila nosaukuma (dd.mm.-dd.mm.), ja tie nav
   norādīti ar --no / --lidz. Ja kaut kas neatpazīstas, labo menu.json
   ar roku vai /admin.
   --------------------------------------------------------------- */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const pdfPath = args.find((a) => !a.startsWith("--"));
const opt = (k) => {
  const i = args.indexOf(k);
  return i >= 0 ? args[i + 1] : null;
};
if (!pdfPath) {
  console.error("Lietošana: npm run menu -- <fails.pdf> [--no YYYY-MM-DD] [--lidz YYYY-MM-DD]");
  process.exit(1);
}

const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");

async function pdfLines(file) {
  const data = new Uint8Array(fs.readFileSync(file));
  const doc = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;
  const out = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    // rindas pēc augstuma ar 4pt pielaidi (cena divrindu ēdienam
    // mēdz stāvēt starp abām rindām)
    const items = content.items
      .filter((it) => it.str && it.str.trim())
      .map((it) => ({ x: it.transform[4], y: it.transform[5], str: it.str, w: it.width }))
      .sort((a, b) => b.y - a.y || a.x - b.x);
    const rows = [];
    for (const it of items) {
      const row = rows.at(-1);
      if (row && Math.abs(row.y - it.y) <= 4) row.parts.push(it);
      else rows.push({ y: it.y, parts: [it] });
    }
    const pageLines = [];
    for (const row of rows) {
      const parts = row.parts.sort((a, b) => a.x - b.x);
      // dubulti zīmēts teksts (ēna, treknraksts) -> viens eksemplārs
      const uniq = [];
      for (const part of parts) {
        const dup = uniq.find((u) => u.str === part.str && Math.abs(u.x - part.x) < 2.5);
        if (!dup) uniq.push(part);
      }
      let line = "";
      let prevEnd = null;
      for (const part of uniq) {
        if (prevEnd !== null) {
          const gap = part.x - prevEnd;
          line += gap < 1.5 ? "" : gap > 12 ? "   " : " ";
        }
        line += part.str;
        prevEnd = part.x + part.w;
      }
      line = line.replace(/\s+$/, "");
      // rinda, kurā ir tikai cena -> pieder iepriekšējai teksta rindai
      if (/^\d+[.,]\d{2}$/.test(line.trim()) && pageLines.length) {
        pageLines.at(-1).text += "   " + line.trim();
        continue;
      }
      pageLines.push({ text: line, x: uniq[0].x });
    }
    out.push(...pageLines);
    out.push({ text: "", x: 0 });
  }
  return out;
}

const PRICE = /^(?<name>.*?)\s+(?<price>\d+[.,]\d{2})\s*$/;
const WEIGHT = /\s(\d+\s?g(?:\/\d+\s?g)?|\d+\/\d+\s?g|\d+\s?ml|\d+\s?kg)\s*$/i;
const norm = (s) => s.replace(/[\s,-]+/g, " ").trim().toLowerCase();

function parse(lines) {
  const sections = [];
  let cur = null;
  let last = null;
  let healthy = false;
  const healthyNames = new Set();
  let hLast = null;

  for (const { text } of lines) {
    const s = text.trim();
    if (!s) continue;
    const squashed = s.replace(/\s+/g, "").toLowerCase();
    if (squashed.startsWith("bistroēdienkarte") || squashed.startsWith("labuapetīti")) continue;
    if (/^\d+\.\d+\.?\s*-\s*\d+\.\d+\.?$/.test(s)) continue;
    if (/^veselīgāku ēdienu izlase/i.test(s)) {
      healthy = true;
      cur = null;
      last = null;
      continue;
    }
    if (/^(ar šādu ābolīti|tie ēdieni|draudzīgāki|izvēle|veselīgāka)$/i.test(s) || s === "a") continue;
    const m = s.match(PRICE);
    if (healthy) {
      if (/^(dienas zupa:|salāti \(|dārzeņu un augļu bārs)/i.test(s)) {
        hLast = null;
        continue;
      }
      if (m) {
        hLast = { name: m.groups.name.trim() };
        healthyNames.add(norm(hLast.name));
      } else if (hLast && (/^[a-zāčēģīķļņšūž(]/.test(s))) {
        hLast.name += " " + s;
        healthyNames.add(norm(hLast.name));
      }
      continue;
    }
    if (m && cur) {
      last = { name: m.groups.name.trim(), price: m.groups.price.replace(",", ".") };
      cur.items.push(last);
      continue;
    }
    if (last && cur && cur.items.at(-1) === last && /^[a-zāčēģīķļņšūž(]/.test(s) && !s.endsWith(":")) {
      last.name += " " + s;
      continue;
    }
    if (s.endsWith(":")) {
      cur = { title: s.replace(/:$/, ""), items: [], sub: true };
      sections.push(cur);
      last = null;
      continue;
    }
    let title = s;
    let unit;
    const um = title.match(/\(([^)]*)\)\s*$/);
    if (um) {
      unit = um[1];
      title = title.slice(0, um.index).trim();
    }
    cur = { title, items: [] };
    if (unit) cur.unit = unit;
    sections.push(cur);
    last = null;
  }

  for (const sec of sections) {
    for (const it of sec.items) {
      let n = it.name.replace(/\s+/g, " ").trim();
      const wm = n.match(WEIGHT);
      if (wm) {
        it.weight = wm[1].replace(/ g/g, "g");
        n = n.slice(0, wm.index).trim();
      }
      const bar = n.match(/^(.*?)\s*\((?:EUR|€)\s*\/\s*kg\)$/i);
      if (bar) {
        n = bar[1];
        it.weight = "1 kg";
      }
      it.name = n.replace(/,$/, "");
      const full = norm(it.name + (it.weight ? " " + it.weight : ""));
      if (healthyNames.has(full) || healthyNames.has(norm(it.name))) it.healthy = true;
    }
  }

  const merged = [];
  for (const sec of sections) {
    if (sec.sub && merged.length) {
      const parent = merged.at(-1);
      (parent.groups ||= []).push({ title: sec.title, items: sec.items });
    } else merged.push(sec);
  }
  for (const sec of merged) {
    delete sec.sub;
    if (sec.groups && !sec.items.length) delete sec.items;
  }
  return merged.filter((s) => (s.items && s.items.length) || s.groups);
}

/** "1.VIII Borščs" -> datums nedēļas ietvaros */
function dateDaySoups(sections, from, to) {
  if (!from) return;
  for (const sec of sections) {
    for (const g of sec.groups || []) {
      for (const it of g.items) {
        const m = it.name.match(/^(\d{1,2})\.[IVX]+\s+(.*)$/);
        if (!m) continue;
        it.name = m[2];
        const day = Number(m[1]);
        const d = new Date(`${from}T12:00:00`);
        const end = to ? new Date(`${to}T12:00:00`) : new Date(d.getTime() + 6 * 86400000);
        while (d <= end && d.getDate() !== day) d.setDate(d.getDate() + 1);
        if (d.getDate() === day) it.date = d.toISOString().slice(0, 10);
      }
    }
  }
}

/** "Bistro-edienkarte-15.09.-21.09.pdf" -> ["2026-09-15","2026-09-21"] */
function datesFromName(file) {
  const m = path.basename(file).match(/(\d{1,2})\.(\d{1,2})\.?\s*-\s*(\d{1,2})\.(\d{1,2})/);
  if (!m) return [null, null];
  const y = new Date().getFullYear();
  const p = (n) => String(n).padStart(2, "0");
  return [`${y}-${p(m[2])}-${p(m[1])}`, `${y}-${p(m[4])}-${p(m[3])}`];
}

const lines = await pdfLines(pdfPath);
const sections = parse(lines);
const [nameFrom, nameTo] = datesFromName(pdfPath);
const validFrom = opt("--no") || nameFrom;
const validTo = opt("--lidz") || nameTo;
dateDaySoups(sections, validFrom, validTo);

const menuPath = path.join(root, "src/data/menu.json");
const menu = JSON.parse(fs.readFileSync(menuPath, "utf8"));
menu.lunch = {
  ...menu.lunch,
  validFrom: validFrom || menu.lunch.validFrom,
  validTo: validTo || null,
  pdf: "/menu/pusdienas.pdf",
  sections,
};
fs.writeFileSync(menuPath, JSON.stringify(menu, null, 2) + "\n");
fs.copyFileSync(pdfPath, path.join(root, "public/menu/pusdienas.pdf"));

const n = sections.reduce(
  (a, s) => a + (s.items?.length || 0) + (s.groups || []).reduce((b, g) => b + g.items.length, 0),
  0
);
console.log(`menu.json: ${sections.length} sadaļas, ${n} ēdieni, spēkā ${validFrom || "?"} – ${validTo || "?"}`);
console.log("PDF nokopēts uz public/menu/pusdienas.pdf. Pārbaudi: npm run dev -> /bistro");
