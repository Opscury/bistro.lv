/* Saņemšanas datums. Laiku klients neizvēlas — to saskaņojam,
   sazinoties ar viņu. Dienu skaits ir konditoreja.json (leadDays). */

import data from "../data/konditoreja.json";

/** Cik dienas iepriekš jāpiesaka pasūtījums. */
export const LEAD_DAYS = data.leadDays ?? 2;

const iso = (d) => {
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

/** Agrākais iespējamais saņemšanas datums (šodien + LEAD_DAYS). */
export function minPickupDate() {
  const d = new Date();
  d.setDate(d.getDate() + LEAD_DAYS);
  return iso(d);
}
