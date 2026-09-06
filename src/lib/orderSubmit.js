/* ---------------------------------------------------------------
   Pasūtījuma pieteikuma nosūtīšana
   ---------------------------------------------------------------
   !!! ŠEIT VĒL NAV ĪSTA BACKEND !!!

   Šobrīd pieteikums tiek nodots klienta e-pasta programmai (mailto),
   tāpēc klientam pašam jānospiež "Sūtīt". Tas darbojas, bet daļa
   klientu pazudīs pa ceļam.

   Kad būs izvēlēts hostings, jāaizvieto TIKAI `sendOrder` funkcijas
   iekšpuse — piemēram:

     const res = await fetch("/api/order", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(payload),
     });
     if (!res.ok) throw new Error("send failed");
     return { method: "api" };

   Serverim jāsūta vēstule uz ORDER_EMAIL.
   --------------------------------------------------------------- */

import { formatQty, formatEur, formatRange } from "../data/konditorejaUnits.js";

export const ORDER_EMAIL = "banketins@inbox.lv";

/** "2026-09-12" -> "12.09.2026" */
function lvDate(iso) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

/** Salasāms pasūtījuma teksts — der gan e-pastam, gan API laukam. */
export function buildOrderText(payload) {
  const { customer, pickup, lines, total, message } = payload;

  const rows = lines.map((l) => {
    const qty = formatQty(l.qty, l.p);
    const sum =
      l.p.priceMin === null
        ? "cena precizējama"
        : formatRange(l.p.priceMin * l.qty, l.p.priceMax * l.qty);
    return `  • ${l.item.name}${l.item.desc ? ` (${l.item.desc})` : ""}` +
      ` — ${qty} × ${l.p.priceText} = ${sum}`;
  });

  return [
    "PASŪTĪJUMA PIETEIKUMS (nav apstiprināts pasūtījums)",
    "",
    "PRECES:",
    ...rows,
    "",
    `Aptuvenā summa: ${formatRange(total.min, total.max)}${
      total.unknown ? " + preces, kurām cena precizējama" : ""
    }`,
    "",
    "SAŅEMŠANA:",
    `  Vēlamais datums: ${lvDate(pickup.date)}`,
    "",
    "KLIENTS:",
    `  Vārds: ${customer.name}`,
    `  Telefons: ${customer.phone}`,
    `  E-pasts: ${customer.email}`,
    "",
    "PIEZĪMES:",
    message ? `  ${message}` : "  —",
  ].join("\n");
}

/**
 * Nosūta pieteikumu.
 * @returns {Promise<{method: "mailto"|"api"}>}
 */
export async function sendOrder(payload) {
  const body = buildOrderText(payload);
  const subject = `Konditorejas pasūtījums — ${payload.customer.name}${
    payload.pickup.date ? ` — ${lvDate(payload.pickup.date)}` : ""
  }`;

  // --- pagaidu risinājums, līdz būs serveris ---
  window.location.href =
    `mailto:${ORDER_EMAIL}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;

  return { method: "mailto" };
}

export { formatEur };
