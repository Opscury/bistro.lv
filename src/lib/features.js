// Iespēju slēdži — ieslēdz un izslēdz vietnes daļas, nedzēšot kodu.

// Konditorejas pasūtījumu sistēma (grozs, pasūtījuma lapa, lipīgā josla,
// "Pievienot" preces logā). Ieslēdz un izslēdz adminā: Konditorejas
// iestatījumi → "Tiešsaistes pasūtījumi ieslēgti" (/api/konditoreja/ →
// orderingEnabled). Mainās bez jaunas būves. Šis ir tikai avārijas slēdzis
// būvei: VITE_ORDERING=off to izslēdz neatkarīgi no admina.
// Bez formu servera (VITE_FORM_ENDPOINT) pasūtījums aiziet caur mailto.
export const ORDERING_ALLOWED = import.meta.env.VITE_ORDERING !== "off";

/** Vai pasūtījumi ieslēgti — no konditorejas datiem (admin). */
export const orderingOn = (konditorejaData) =>
  ORDERING_ALLOWED && konditorejaData?.orderingEnabled === true;

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
