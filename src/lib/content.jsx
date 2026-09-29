/* ---------------------------------------------------------------
   Vietnes saturs: vispirms momentuzņēmums, tad tiešie dati.

   Pirmā izdruka (prerender un hydrate) vienmēr ir no src/data/*.json —
   tie paši faili, no kuriem uzbūvēts statiskais HTML, tāpēc nekas
   nelēkā un React nebrīdina par nesakritību. Pēc tam pārlūks klusi
   pieprasa /api/site/ (un konditorejas lapā /api/konditoreja/) ar 4 s
   laika limitu; ja atbilde izskatās pareiza, saturs tiek nomainīts.
   Ja API nav, ir lēns vai atbild dīvaini — paliek momentuzņēmums,
   bez kļūdām un bez "ielādējas".

   Saturu adminā maina Silvas darbinieki (silva-api); momentuzņēmumu
   pirms katras būves atjauno scripts/snapshot.mjs.
   --------------------------------------------------------------- */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import linesSnapshot from "../data/lines.json";
import contentSnapshot from "../data/content.json";
import konditorejaSnapshot from "../data/konditoreja.json";
import { validKonditoreja, validSite } from "./contentShape.js";

export const TIMEOUT_MS = 4000;

export const siteSnapshot = { ...linesSnapshot, ...contentSnapshot };
export { konditorejaSnapshot };

const ContentContext = createContext({
  site: siteSnapshot,
  konditoreja: konditorejaSnapshot,
  wantKonditoreja: () => {},
});

async function fetchJson(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null; // tīkls, laika limits, ne-JSON — paliek momentuzņēmums
  } finally {
    clearTimeout(timer);
  }
}

/** Tiešie dati virs momentuzņēmuma: ja API kādu atslēgu neatsūta, paliek vecā. */
function mergeSite(base, live) {
  return {
    ...base,
    ...live,
    texts: { ...base.texts, ...live.texts },
    photos: { ...base.photos, ...live.photos },
    galleries: { ...base.galleries, ...live.galleries },
    notices: { ...base.notices, ...live.notices },
  };
}

export function ContentProvider({ children }) {
  const [site, setSite] = useState(siteSnapshot);
  const [konditoreja, setKonditoreja] = useState(konditorejaSnapshot);
  const konditorejaRequested = useRef(false);

  useEffect(() => {
    let alive = true;
    fetchJson("/api/site/").then((data) => {
      if (alive && validSite(data)) setSite(mergeSite(siteSnapshot, data));
    });
    return () => {
      alive = false;
    };
  }, []);

  // konditorejas piedāvājumu pieprasa tikai tā lapa (liels saraksts)
  const wantKonditoreja = useCallback(() => {
    if (konditorejaRequested.current) return;
    konditorejaRequested.current = true;
    fetchJson("/api/konditoreja/").then((data) => {
      if (validKonditoreja(data)) setKonditoreja(data);
    });
  }, []);

  const value = useMemo(() => ({ site, konditoreja, wantKonditoreja }), [site, konditoreja, wantKonditoreja]);
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

/** { company, lines, venues, texts, photos, galleries, notices, rentalPrices } */
export function useSite() {
  return useContext(ContentContext).site;
}

export function useKonditoreja() {
  const { konditoreja, wantKonditoreja } = useContext(ContentContext);
  useEffect(() => wantKonditoreja(), [wantKonditoreja]);
  return konditoreja;
}

/** Aizvieto {tālrunis}, {dienas} u.tml. */
export function fill(text, vars) {
  if (!text || !vars) return text || "";
  return text.replace(/\{([^{}]+)\}/g, (m, key) => (key in vars ? String(vars[key]) : m));
}

/** Teksts pēc atslēgas (Teksti vietnē). */
export function useTexts() {
  const { texts } = useSite();
  return useCallback((key, vars) => fill(texts[key] ?? "", vars), [texts]);
}

/** "a\n\nb" -> ["a", "b"] — tukša rinda = jauna rindkopa. */
export function paragraphs(text) {
  return (text || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** "a\nb" -> ["a", "b"] — katra rinda atsevišķi (saraksti). */
export function textLines(text) {
  return (text || "")
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);
}

export const lineById = (site, id) => site.lines.find((l) => l.id === id);
export const venueById = (site, id) => site.venues.find((v) => v.id === id);
