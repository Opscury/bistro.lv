// Minimālā API atbilžu pārbaude. To pašu lieto pārlūks (content.jsx),
// pirms nomaina momentuzņēmumu ar tiešajiem datiem, un scripts/snapshot.mjs,
// pirms pārraksta src/data failus. Ja kaut kas nesakrīt — paliek vecais.

const isObj = (v) => v !== null && typeof v === "object" && !Array.isArray(v);

export function validSite(d) {
  return (
    isObj(d) &&
    isObj(d.company) &&
    typeof d.company.name === "string" &&
    Array.isArray(d.lines) &&
    d.lines.length > 0 &&
    d.lines.every((l) => isObj(l) && typeof l.id === "string" && Array.isArray(l.hours)) &&
    Array.isArray(d.venues) &&
    isObj(d.texts) &&
    isObj(d.photos) &&
    isObj(d.galleries) &&
    Object.values(d.galleries).every((g) => isObj(g) && Array.isArray(g.images)) &&
    isObj(d.notices) &&
    Array.isArray(d.rentalPrices)
  );
}

export function validKonditoreja(d) {
  return (
    isObj(d) &&
    Array.isArray(d.categories) &&
    d.categories.every(
      (c) => isObj(c) && typeof c.id === "string" && Array.isArray(c.items) &&
        c.items.every((i) => isObj(i) && typeof i.name === "string")
    )
  );
}
