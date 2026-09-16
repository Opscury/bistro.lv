// Viens avots visām vietām: adreses, darba laiki, tālruņi, e-pasti.
// Dati ir lines.json (rediģējams arī /admin), šeit — palīgfunkcijas,
// kas no tiem veido sākumlapas kartītes, mastheadus, Kontaktus,
// kājeni un JSON-LD. Mainot darba laiku, jālabo tikai lines.json.

import data from "./lines.json";

export const company = data.company;
export const lines = data.lines;
export const venues = data.venues;

export const lineById = Object.fromEntries(lines.map((l) => [l.id, l]));

/** Klasteri pēc zīmola arhitektūras lēmuma (Configured Hybrid). */
export const CLUSTERS = {
  core: { endorsed: false },     // bistro + konditoreja — pati Silva
  teja: { endorsed: true },      // tējas namiņš — Silvas atbalstīta līnija
  banketi: { endorsed: true },   // banketi — Silvas atbalstīta līnija
};

const DAY_SHORT = { Mo: "P.", Tu: "O.", We: "T.", Th: "C.", Fr: "Pk.", Sa: "S.", Su: "Sv." };
const DAY_LONG = {
  Mo: "pirmdien", Tu: "otrdien", We: "trešdien", Th: "ceturtdien",
  Fr: "piektdien", Sa: "sestdien", Su: "svētdien",
};
const DAY_SCHEMA = {
  Mo: "Monday", Tu: "Tuesday", We: "Wednesday", Th: "Thursday",
  Fr: "Friday", Sa: "Saturday", Su: "Sunday",
};
const ORDER = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/** ["Mo".."Fr"] -> "P.–Pk." | ["Sa","Su"] -> "S., Sv." | ["Su"] -> "Sv." */
export function formatDays(days, { long = false } = {}) {
  const names = long ? DAY_LONG : DAY_SHORT;
  const idx = days.map((d) => ORDER.indexOf(d)).sort((a, b) => a - b);
  const consecutive = idx.every((v, i) => i === 0 || v === idx[i - 1] + 1);
  if (idx.length === 7) return long ? "Katru dienu" : "P.–Sv.";
  if (idx.length >= 3 && consecutive) {
    const a = names[ORDER[idx[0]]];
    const b = names[ORDER[idx[idx.length - 1]]];
    return long ? `${cap(a)}–${b}` : `${a}–${b}`;
  }
  const list = idx.map((i) => names[ORDER[i]]);
  return long ? cap(list.join(", ")) : list.join(", ");
}

/** "08:00" -> "8.00" (kā uz durvīm) */
export const formatTime = (t) => t.replace(/^0/, "").replace(":", ".");

/** Viena rinda: { label, value, closed } */
export function hoursRows(line, { long = false } = {}) {
  return line.hours.map((h) => ({
    label: formatDays(h.days, { long }),
    value: h.closed ? "brīvdiena" : `${formatTime(h.open)}–${formatTime(h.close)}`,
    closed: Boolean(h.closed),
  }));
}

/** Faktu rinda mastheadam: ["Driksas iela 9, Jelgava", "P.–Pk. 8.00–17.00", ...] */
export function factList(line) {
  const out = [];
  if (line.address) out.push(`${line.address.street}, ${line.address.city}`);
  for (const r of hoursRows(line)) out.push(`${r.label} ${r.value}`);
  return out;
}

export const telHref = (n) => `tel:${n.replace(/\s/g, "")}`;

export function fullAddress(line) {
  if (!line.address) return null;
  const a = line.address;
  return `${a.street}, ${a.city}, ${a.postal}, Latvija`;
}

/** Saites uz kartēm — tas, ko cilvēks telefonā tiešām nospiež. */
export function mapLinks(line) {
  if (!line.address) return null;
  const q = encodeURIComponent(`${line.address.street}, ${line.address.city}, Latvia`);
  return {
    google: `https://www.google.com/maps/search/?api=1&query=${q}`,
    waze: `https://waze.com/ul?q=${q}&navigate=yes`,
  };
}

/** Tālruņi pēc mērķa — Kontaktu lapai un kājenei. */
export function phoneList() {
  const out = lines
    .filter((l) => l.phone)
    .map((l) => ({ label: l.phoneLabel || cap(l.name), value: l.phone }));
  out.push({ label: "Atsauksmēm", value: company.feedbackPhone });
  return out;
}

export function emailList() {
  return [
    { label: "Banketu un konditorejas pasūtījumiem", value: lineById.banketi.email },
    { label: "Atsauksmēm", value: company.feedbackEmail },
  ];
}

/** JSON-LD: organizācija + katra vieta ar darba laiku. */
export function jsonLd() {
  const org = {
    "@type": "Organization",
    "@id": `${company.url}/#org`,
    name: company.name,
    legalName: company.legalName,
    url: company.url,
    foundingDate: String(company.founded),
    logo: `${company.url}/silva-logo.svg`,
    sameAs: [company.instagram],
    address: { "@type": "PostalAddress", addressLocality: company.city, addressCountry: "LV" },
  };
  const places = lines
    .filter((l) => l.address)
    .map((l) => ({
      "@type": l.schemaType,
      "@id": `${company.url}${l.path}#place`,
      name: `Silva ${l.name}`,
      url: `${company.url}${l.path}`,
      image: `${company.url}/img/${l.photo}`,
      parentOrganization: { "@id": org["@id"] },
      telephone: l.phone || undefined,
      email: l.email || undefined,
      servesCuisine: "Latvian",
      address: {
        "@type": "PostalAddress",
        streetAddress: l.address.street,
        addressLocality: l.address.city,
        postalCode: l.address.postal,
        addressCountry: "LV",
      },
      openingHoursSpecification: l.hours
        .filter((h) => !h.closed)
        .map((h) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: h.days.map((d) => DAY_SCHEMA[d]),
          opens: h.open,
          closes: h.close,
        })),
    }));
  const banketi = lineById.banketi;
  places.push({
    "@type": "FoodService",
    "@id": `${company.url}${banketi.path}#service`,
    name: "Silva banketi",
    url: `${company.url}${banketi.path}`,
    provider: { "@id": org["@id"] },
    telephone: banketi.phone,
    email: banketi.email,
    areaServed: "Jelgava, Zemgale",
  });
  return { "@context": "https://schema.org", "@graph": [org, ...places] };
}
