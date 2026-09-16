/* ---------------------------------------------------------------
   Konditorejas pasūtījuma pieteikuma nosūtīšana.
   Transportu (serveris / Netlify / mailto) izvēlas lib/sendForm.js —
   šeit tikai pasūtījuma teksts.
   --------------------------------------------------------------- */

import { formatQty, formatEur, formatRange } from "../data/konditorejaUnits.js";
import data from "../data/konditoreja.json";
import { sendForm } from "./sendForm.js";

export const ORDER_EMAIL = data.orderEmail;
export const ORDER_PHONE = data.orderPhone;

/** "2026-09-12" -> "12.09.2026" */
export function lvDate(iso) {
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
    ...(rows.length ? rows : ["  —"]),
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
 * @returns {Promise<{method: "api"|"netlify"|"mailto"}>}
 */
export async function sendOrder(payload) {
  const body = buildOrderText(payload);
  const subject = `Konditorejas pasūtījums — ${payload.customer.name}${
    payload.pickup.date ? ` — ${lvDate(payload.pickup.date)}` : ""
  }`;

  return sendForm(
    "pasutijums",
    {
      name: payload.customer.name,
      phone: payload.customer.phone,
      email: payload.customer.email,
      date: payload.pickup.date,
      message: payload.message,
      order: body,
    },
    { to: ORDER_EMAIL, subject, body }
  );
}

export { formatEur };
