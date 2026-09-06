/* Saņemšanas datums. Laiku klients vairs neizvēlas — to saskaņojam,
   sazinoties ar viņu.                                                */

/** Cik dienas iepriekš jāpiesaka pasūtījums. */
export const LEAD_DAYS = 2;

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
