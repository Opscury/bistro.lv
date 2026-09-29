// Katras lapas nosaukums, apraksts un attēls kopīgošanai. Lieto
// usePageMeta (pārlūkā, mainot lapu) un scripts/prerender.mjs
// (būvējot statisko HTML katram ceļam). Darba laiki, adreses, gads un
// cilvēku skaits aprakstos nāk no datiem (admin), nevis ir ierakstīti šeit.

import { siteSnapshot } from "../lib/content.jsx";
import { hoursSentence, streetWhere } from "./lines.js";

export const SITE_URL = "https://bistro.lv";
export const SITE_NAME = "Silva";

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const line = (site, id) => site.lines.find((l) => l.id === id) || { hours: [] };
const street = (site, id) => streetWhere(line(site, id).address?.street);
/** "Driksas ielā 9" -> "Driksas ielā" */
const streetName = (site, id) => street(site, id).replace(/\s+\d+\w*$/, "");

export function buildRoutesMeta(site) {
  const zale = site.venues.find((v) => v.id === "zale");
  return {
    "/": {
      title: "Silva — bistro, konditoreja, tējas namiņš un banketi Jelgavā",
      description:
        `Silva Jelgavā kopš ${site.company.founded}. gada: bistro un konditoreja ${streetName(site, "bistro")}, tējas namiņš Pasta salā, banketi un telpu noma. Darba laiki, ēdienkartes un kontakti.`,
      og: "/og/home.jpg",
    },
    "/bistro": {
      title: "Bistro — Silva, Jelgava",
      description:
        `Pusdienas un brokastis Jelgavas centrā, ${street(site, "bistro")}. Jauna ēdienkarte katru nedēļu, ${hoursSentence(line(site, "bistro"))}, brokastis līdz 11.00.`,
      og: "/og/bistro.jpg",
    },
    "/konditoreja": {
      title: "Konditoreja — Silva, Jelgava",
      description:
        `Kūkas, tortes, kliņģeri, pīrādziņi, smalkmaizītes un cepumi no Silvas konditorejas ${street(site, "konditoreja")}, Jelgavā. Piedāvājums ar cenām un pasūtījumi pa tālruni vai e-pastu.`,
      og: "/og/konditoreja.jpg",
    },
    "/tejas-namins": {
      title: "Tējas namiņš — Silva, Jelgava",
      description:
        `Tējas namiņš Pasta salā starp Lielupi un Driksu: tējas, kafija, kūkas un saldējuma kokteiļi ar skatu uz upi. ${cap(hoursSentence(line(site, "tejas-namins")))}.`,
      og: "/og/tejas-namins.jpg",
    },
    "/banketi": {
      title: "Banketi — Silva, Jelgava",
      description:
        "Banketu serviss Jelgavā: kāzas, jubilejas, korporatīvie pasākumi, kafijas pauzes un izbraukuma ēdināšana ar individuāli sastādītu ēdienkarti.",
      og: "/og/banketi.jpg",
    },
    "/noma": {
      title: "Telpu noma — Silva, Jelgava",
      description:
        `Viesību un semināru zāle līdz ${zale?.capacity ?? 90} cilvēkiem Bistro Silva 2. stāvā, pontons un peldterase uz Driksas. Cenas, aprīkojums un ēdināšana.`,
      og: "/og/noma.jpg",
    },
    "/kontakti": {
      title: "Kontakti — Silva, Jelgava",
      description:
        "Silvas adreses, darba laiki, tālruņi un e-pasti: bistro, konditoreja, tējas namiņš un banketu serviss Jelgavā.",
      og: "/og/kontakti.jpg",
    },
    "/404": {
      title: "Lapa nav atrasta — Silva",
      description: "Šādas lapas nav. Sākumlapa, ēdienkartes un kontakti ir izvēlnē.",
      og: "/og/home.jpg",
      noindex: true,
    },
  };
}

// Statiskajam HTML (prerender) — no momentuzņēmuma.
export const routesMeta = buildRoutesMeta(siteSnapshot);

export function metaFor(pathname, site = siteSnapshot) {
  const meta = site === siteSnapshot ? routesMeta : buildRoutesMeta(site);
  return meta[pathname] || meta["/404"];
}
