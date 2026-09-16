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
