import { useCallback, useEffect, useMemo, useState } from "react";
import data from "../data/konditoreja.json";
import { itemKey, pricing } from "../data/konditorejaUnits.js";

const STORAGE_KEY = "silva-konditoreja-cart-v1";

/** Ātrai meklēšanai: atslēga -> { item, category, pricing } */
const CATALOG = new Map();
for (const cat of data.categories) {
  for (const item of cat.items) {
    CATALOG.set(itemKey(cat.id, item), {
      item,
      categoryId: cat.id,
      categoryTitle: cat.title,
      p: pricing(item, cat.id),
    });
  }
}

export function lookup(key) {
  return CATALOG.get(key);
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    // izmet preces, kuru vairs nav katalogā (piem., pēc piedāvājuma maiņas)
    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([k, v]) => CATALOG.has(k) && typeof v === "number" && v > 0
      )
    );
  } catch {
    return {};
  }
}

/**
 * Konditorejas grozs. Nav pirkums — tikai saraksts, ko klients nosūta
 * kā pieteikumu. Glabājas pārlūkā, lai nepazustu, pārlādējot lapu.
 * Pārlūka atmiņu nolasa tikai pēc pirmās izdrukas, lai statiskais HTML
 * (prerender) un pirmais React skats sakristu.
 */
export default function useCart() {
  const [qtys, setQtys] = useState({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setQtys(load());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(qtys));
    } catch {
      /* privātais režīms u.tml. — grozs vienkārši nesaglabāsies */
    }
  }, [qtys, ready]);

  const setQty = useCallback((key, qty) => {
    const entry = CATALOG.get(key);
    if (!entry) return;
    setQtys((prev) => {
      const next = { ...prev };
      if (qty === null || qty < entry.p.minQty) delete next[key];
      else next[key] = round(qty, entry.p.decimals);
      return next;
    });
  }, []);

  const add = useCallback((key, qty) => {
    const entry = CATALOG.get(key);
    if (!entry) return;
    setQtys((prev) => {
      const wanted = qty ?? entry.p.minQty;
      const current = prev[key] ?? 0;
      return {
        ...prev,
        [key]: round(Math.max(entry.p.minQty, current + wanted), entry.p.decimals),
      };
    });
  }, []);

  const remove = useCallback((key) => {
    setQtys((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const clear = useCallback(() => setQtys({}), []);

  const lines = useMemo(
    () =>
      Object.entries(qtys)
        .map(([key, qty]) => ({ key, qty, ...CATALOG.get(key) }))
        .filter((l) => l.item),
    [qtys]
  );

  /** Aptuvenā summa. Ja kādai precei ir cenu diapazons, summa arī ir diapazons. */
  const total = useMemo(() => {
    let min = 0;
    let max = 0;
    let unknown = false;
    for (const l of lines) {
      if (l.p.priceMin === null) {
        unknown = true;
        continue;
      }
      min += l.p.priceMin * l.qty;
      max += l.p.priceMax * l.qty;
    }
    return { min, max, unknown, isRange: Math.abs(max - min) >= 0.005 };
  }, [lines]);

  return {
    qtys,
    lines,
    count: lines.length,
    total,
    ready,
    add,
    setQty,
    remove,
    clear,
  };
}

function round(n, decimals) {
  const f = 10 ** decimals;
  return Math.round(n * f) / f;
}
