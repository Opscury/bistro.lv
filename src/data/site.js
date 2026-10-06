// Vietnes struktūra, ko adminā nemaina: izvēlne un izslēgtās sadaļas teksts.
// Viss pārējais saturs (teksti, foto, galerijas, aktualitātes, darba laiki,
// kontakti) nāk no Silvas admin — src/lib/content.jsx, momentuzņēmums
// src/data/lines.json + content.json.

import { lines } from "./lines.js";

// Izvēlne — tādā pašā secībā kā sākumlapa: bistro un konditoreja
// (Silvas ikdienas pāris), tējas namiņš, banketi, tad vietas un kontakti.
export const nav = [
  ...lines.map((l) => ({ to: l.path, label: l.name })),
  { to: "/noma", label: "Telpu noma" },
  { to: "/kontakti", label: "Kontakti" },
];

// Sākumlapa: "par Silvu" (sadaļa izslēgta ar ABOUT_ENABLED). Teksts paliek
// šeit, kamēr sadaļa nav saskaņota; ieslēdzot to var pārcelt uz admin.
export const aboutText = [
  "Silva ir ģimenes uzņēmums Jelgavā kopš 1994. gada. Viena virtuve gatavo visām četrām vietām — bistro un konditorejai Driksas ielā, tējas namiņam Pasta salā un banketiem tur, kur tie notiek.",
  "Vai tās ir pusdienas darba dienā, kūka svētkiem vai galds simts viesiem — mērķis nemainās: plaša izvēle un kvalitāte, uz kuru var paļauties.",
];
