/* ---------------------------------------------------------------
   Konditoreja — cenu un daudzuma loģika
   ---------------------------------------------------------------
   Produktu cenas JSON failā ir teksts, divos formātos:
     "14.00 €/1 kg"     -> cena par kilogramu
     "0.50 €"           -> cena par gabalu
     "25.00-30.00 €/kg" -> cenu diapazons (personalizēti pasūtījumi)

   Šeit tas tiek pārvērsts skaitļos, un katrai kategorijai tiek
   piekārtots minimālais pasūtījuma daudzums.
   --------------------------------------------------------------- */

/**
 * Minimālais pasūtījuma daudzums pa kategorijām.
 * Virs minimuma klients var izvēlēties jebkuru daudzumu.
 *
 *   kg      – minimums kilogramos precēm ar cenu €/kg
 *   gab     – minimums gabalos precēm ar cenu par gabalu
 *   kgStep  – par cik palielinās daudzums, spiežot "+" (pēc noklusējuma 0.5)
 *
 * Ja mainās veikala noteikumi, jālabo tikai šī tabula.
 */
export const CATEGORY_LIMITS = {
  "saldie-klingeri": { kg: 1 },
  "salie-klingeri": { kg: 1 },
  platsmaizes: { kg: 0.5 },
  piradzini: { gab: 10 },
  smalkmaizites: { gab: 10 },
  cepumi: { kg: 0.5, gab: 10 }, // šajā kategorijā ir abu veidu preces
  "mazas-kucinas": { gab: 10 },
  kukas: { gab: 5 },
  tortes: { kg: 0.8, kgStep: 0.1 },
  "pasutijumu-tortes": { kg: 1 },
};

const DEFAULT_LIMITS = { kg: 0.5, gab: 1, kgStep: 0.5 };

/** Nolasa skaitļus no cenas teksta. */
function parsePrice(raw) {
  if (!raw) return { unit: "gab", min: null, max: null };

  const perKg = /\/\s*1?\s*kg/i.test(raw);
  const numbers = (raw.match(/\d+[.,]?\d*/g) || [])
    .map((n) => parseFloat(n.replace(",", ".")))
    // "€/1 kg" satur ciparu "1", kas nav cena — to nogriež apakšā
    .filter((n) => !Number.isNaN(n));

  // "14.00 €/1 kg" -> [14, 1];  "25.00-30.00 €/kg" -> [25, 30];  "0.50 €" -> [0.5]
  let min = null;
  let max = null;
  if (perKg && /\/\s*1\s*kg/i.test(raw)) {
    // pēdējais skaitlis ir "1" no "/1 kg" — to izmet
    const vals = numbers.slice(0, -1);
    min = vals[0] ?? null;
    max = vals[1] ?? min;
  } else {
    min = numbers[0] ?? null;
    max = numbers[1] ?? min;
  }

  return { unit: perKg ? "kg" : "gab", min, max };
}

/**
 * Visa preces cenu/daudzuma informācija vienuviet.
 * @returns {{
 *   unit: "kg"|"gab", unitLabel: string,
 *   priceMin: number|null, priceMax: number|null, isRange: boolean,
 *   minQty: number, step: number, decimals: number, priceText: string
 * }}
 */
export function pricing(item, categoryId) {
  const { unit, min, max } = parsePrice(item.price);
  const limits = { ...DEFAULT_LIMITS, ...(CATEGORY_LIMITS[categoryId] || {}) };

  const isKg = unit === "kg";
  return {
    unit,
    unitLabel: isKg ? "kg" : "gab.",
    priceMin: min,
    priceMax: max,
    isRange: min !== null && max !== null && max > min,
    minQty: isKg ? limits.kg : limits.gab,
    step: isKg ? limits.kgStep ?? DEFAULT_LIMITS.kgStep : 1,
    decimals: isKg ? 1 : 0,
    priceText: item.price || "",
    // Piedāvājumā cenas ir rakstītas nevienādi ("14.00 €/1 kg", "0.70€").
    // Šī ir sakārtota, īsāka versija, kas neplīst pušu šaurā kolonnā.
    shortPrice: shortPrice(min, max, isKg),
  };
}

function shortPrice(min, max, isKg) {
  if (min === null) return "cena pēc vienošanās";
  const unit = isKg ? "€/kg" : "€/gab.";
  return max > min
    ? `${min.toFixed(2)}–${max.toFixed(2)} ${unit}`
    : `${min.toFixed(2)} ${unit}`;
}

/** Stabila atslēga grozam — vārds var atkārtoties, attēls nē. */
export function itemKey(categoryId, item) {
  return `${categoryId}|${item.img || item.name}`;
}

/** 1 -> "1 kg", 1.5 -> "1.5 kg", 12 -> "12 gab." */
export function formatQty(qty, p) {
  const n = p.decimals ? Number(qty.toFixed(p.decimals)) : Math.round(qty);
  return `${n} ${p.unitLabel}`;
}

/** 14 -> "14.00 €" */
export function formatEur(value) {
  return `${value.toFixed(2)} €`;
}

/**
 * Summas diapazons kā teksts. Ja apakšējā un augšējā robeža sakrīt,
 * rāda vienu skaitli, citādi "24.00 – 27.00 €".
 */
export function formatRange(min, max) {
  if (min === null) return "—";
  return Math.abs(max - min) < 0.005
    ? formatEur(min)
    : `${min.toFixed(2)} – ${max.toFixed(2)} €`;
}

/** Diētas atzīmju tulkojumi (item.diet masīvā). */
export const DIET_LABELS = {
  vegan: "Vegāns",
  vegetarian: "Veģetārs",
  "gluten-free": "Bez lipekļa",
  "lactose-free": "Bez laktozes",
  "sugar-free": "Bez cukura",
};
