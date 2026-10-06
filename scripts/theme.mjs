/* ---------------------------------------------------------------
   Vietnes fonti no src/data/theme.json.

   theme.json ir momentuzņēmums no Django admin (/theme.json), ko
   scripts/snapshot.mjs atjauno pirms katras būves. Šeit — pārbaude
   un CSS ģenerēšana; to lieto gan snapshot skripts, gan vite-plugin-theme.
   --------------------------------------------------------------- */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const themeFile = path.join(root, "src", "data", "theme.json");
const fontsDir = path.join(root, "public", "fonts");

// Tikai tas, kas drīkst nonākt CSS: nekādu iekavu, semikolu, < > vai \.
const SAFE_NAME = /^[A-Za-z0-9 ]{1,60}$/;
const SAFE_STACK = /^[A-Za-z0-9 ",\-]{1,200}$/;
const SAFE_FILE = /^[a-z0-9-]+\.woff2$/;
const SAFE_WEIGHT = /^\d{3,4}( \d{3,4})?$/;
const SAFE_STRETCH = /^\d{2,3}% \d{2,3}%$/;
const SAFE_RANGE = /^[U+0-9A-F, -]{1,600}$/;
const ROLES = ["head", "body", "mono"];

/** Izmet kļūdu, ja tēma nav derīga vai trūkst fontu failu. */
export function validateTheme(t) {
  if (!t || typeof t !== "object" || !t.fonts) throw new Error("nav 'fonts'");
  for (const role of ROLES) {
    const f = t.fonts[role];
    if (!f) throw new Error(`nav fonta lomai '${role}'`);
    if (!SAFE_NAME.test(f.family)) throw new Error(`${role}: slikts family`);
    if (!SAFE_STACK.test(f.stack)) throw new Error(`${role}: slikts stack`);
    if (!Array.isArray(f.faces) || !f.faces.length) throw new Error(`${role}: nav faces`);
    for (const face of f.faces) {
      if (!SAFE_FILE.test(face.file)) throw new Error(`${role}: slikts fails ${face.file}`);
      if (!fs.existsSync(path.join(fontsDir, face.file)))
        throw new Error(`${role}: public/fonts/ nav ${face.file}`);
      if (!SAFE_WEIGHT.test(String(face.weight))) throw new Error(`${role}: slikts weight`);
      if (face.stretch && !SAFE_STRETCH.test(face.stretch)) throw new Error(`${role}: slikts stretch`);
      if (!SAFE_RANGE.test(face.unicodeRange)) throw new Error(`${role}: slikts unicodeRange`);
    }
  }
  const w = Number(t.headingWeight);
  if (![500, 600, 700, 800].includes(w)) throw new Error("slikts headingWeight");
  return t;
}

export function readTheme() {
  return validateTheme(JSON.parse(fs.readFileSync(themeFile, "utf8")));
}

/** @font-face visiem izvēlētajiem fontiem + --font-* mainīgie. */
export function themeCss(t) {
  const faces = [];
  const seen = new Set();
  for (const role of ROLES) {
    const f = t.fonts[role];
    for (const face of f.faces) {
      if (seen.has(face.file)) continue;
      seen.add(face.file);
      faces.push(
        `@font-face {
  font-family: "${f.family}";
  font-style: normal;
  font-weight: ${face.weight};${face.stretch ? `\n  font-stretch: ${face.stretch};` : ""}
  font-display: swap;
  src: url(/fonts/${face.file}) format("woff2");
  unicode-range: ${face.unicodeRange};
}`
      );
    }
  }
  return `/* Ģenerēts no src/data/theme.json (Django admin → Vietnes izskats → Fonti). */
${faces.join("\n")}
:root {
  --font-head: ${t.fonts.head.stack};
  --font-body: ${t.fonts.body.stack};
  --font-mono: ${t.fonts.mono.stack};
  --heading-weight: ${Number(t.headingWeight)};
}
`;
}

/** Virsrakstu fonts ir redzams uzreiz, tāpēc to ielādē iepriekš (abi burtu komplekti). */
export function preloadTags(t) {
  return t.fonts.head.faces.map((face) => ({
    tag: "link",
    attrs: { rel: "preload", href: `/fonts/${face.file}`, as: "font", type: "font/woff2", crossorigin: "" },
    injectTo: "head-prepend",
  }));
}
