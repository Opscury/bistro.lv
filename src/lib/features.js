// Iespēju slēdži — ieslēdz un izslēdz vietnes daļas, nedzēšot kodu.

import { FORMS_ENABLED } from "./sendForm.js";

// Konditorejas pasūtījumu sistēma (grozs, pasūtījuma lapa, lipīgā josla,
// "Pievienot" preces logā). Ieslēdzas pati, tiklīdz formām ir īsts
// serveris (VITE_FORM_ENDPOINT vai VITE_NETLIFY_FORMS) — ar mailto tā
// zaudētu pasūtījumus. Ja gribi to turēt izslēgtu arī ar serveri,
// ieliec .env: VITE_ORDERING=off. Pirms ieslēgšanas: kas atbild uz
// pasūtījumiem un cik ātri.
export const ORDERING_ENABLED =
  FORMS_ENABLED && import.meta.env.VITE_ORDERING !== "off";

// Banketu pieteikuma forma banketu lapā (datums, viesi, veids, vieta).
// Pagaidām izslēgta — tās vietā tālrunis, e-pasts un poga uz Kontaktiem.
// Ieslēgt, kad ir formu serveris un kāds atbild uz pieteikumiem.
export const ENQUIRY_FORM_ENABLED = false;

// Konditorejas preces logs (klikšķis uz preces -> uznirstošais logs ar
// lielo bildi, cenu un sastāvu). Pagaidām izslēgts — pārskatīsim pēc
// palaišanas. Izslēgts rinda paliek rinda: bez klikšķa, bez "vairāk".
export const ITEM_SHEET_ENABLED = false;

// Sākumlapas sadaļa "par Silvu" (ģimenes uzņēmums · viena virtuve ·
// četras vietas + divas rindkopas). Pagaidām izslēgta; teksts paliek
// data/site.js (aboutText). Ieslēgt, kad teksts ir saskaņots.
export const ABOUT_ENABLED = false;
