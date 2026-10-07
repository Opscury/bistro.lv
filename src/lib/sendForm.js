/* ---------------------------------------------------------------
   Formu nosūtīšana — viens ceļš Kontaktu ziņai, banketu pieteikumam
   un konditorejas pasūtījumam.

   Trīs režīmi, pēc prioritātes:

   1. VITE_FORM_ENDPOINT — jebkurš URL, kas pieņem JSON POST
      (Formspree, Web3Forms, savs Cloudflare Worker / Netlify
      Function). Ieliek .env: VITE_FORM_ENDPOINT=https://…
   2. VITE_NETLIFY_FORMS=true — Netlify Forms. index.html satur
      slēptās formas ar tiem pašiem lauku nosaukumiem, tāpēc Netlify
      tās atpazīst būvējot; nosūtīšana ir POST uz "/".
   3. Neviens nav iestatīts — atver e-pasta programmu (mailto).
      Darbojas, bet daļa cilvēku pa ceļam pazūd, tāpēc pasūtījumu
      sistēma šajā režīmā paliek izslēgta (skat. features.js).

   Visi lauki tiek sūtīti kā teksts. Servera pusē vēstule jāsūta uz
   attiecīgās līnijas e-pastu (lines.json).
   --------------------------------------------------------------- */

const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT || "";
const NETLIFY = import.meta.env.VITE_NETLIFY_FORMS === "true";

/** Vai ir īsts serveris, kas saņem formas (nevis mailto). */
export const FORMS_ENABLED = Boolean(ENDPOINT) || NETLIFY;

/** Ko rādīt cilvēkam pēc nosūtīšanas. */
export const SEND_METHOD = ENDPOINT ? "api" : NETLIFY ? "netlify" : "mailto";

/**
 * @param {string} formName  "kontakti" | "banketi" | "pasutijums"
 * @param {Record<string,string>} fields  lauki (teksts)
 * @param {{to: string, subject: string, body: string}} mail  rezerves e-pasts
 * @returns {Promise<{method: "api"|"netlify"|"mailto"}>}
 */
export async function sendForm(formName, fields, mail) {
  const clean = Object.fromEntries(
    Object.entries(fields).map(([k, v]) => [k, v == null ? "" : String(v)])
  );

  if (ENDPOINT) {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      // t = ms kopš lapas ielādes: serveris uzskata ļoti ātrus sūtījumus par robotiem
      body: JSON.stringify({ form: formName, ...clean, t: String(Math.round(performance.now())) }),
    });
    if (!res.ok) {
      const err = new Error(`send failed: ${res.status}`);
      err.userMessage = await serverMessage(res);
      throw err;
    }
    return { method: "api" };
  }

  if (NETLIFY) {
    const body = new URLSearchParams({ "form-name": formName, ...clean });
    const res = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    if (!res.ok) throw new Error(`send failed: ${res.status}`);
    return { method: "netlify" };
  }

  window.location.href =
    `mailto:${mail.to}?subject=${encodeURIComponent(mail.subject)}` +
    `&body=${encodeURIComponent(mail.body)}`;
  return { method: "mailto" };
}

/** Servera kļūda cilvēkam saprotamā veidā (vai null — tad forma rāda savu tekstu). */
async function serverMessage(res) {
  if (res.status === 429) return "Pārāk daudz ziņu īsā laikā. Lūdzu, mēģiniet vēlāk vai rakstiet mums uz e-pastu.";
  if (res.status !== 400) return null;
  try {
    const data = await res.json(); // {lauks: ["ziņa"]}
    const first = Object.values(data).flat().find((m) => typeof m === "string");
    return first || null;
  } catch {
    return null;
  }
}

/** Salasāms teksts no laukiem — mailto rezervei un e-pasta saturam. */
export function fieldsToText(pairs) {
  return pairs
    .filter(([, v]) => v != null && String(v).trim() !== "")
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}
