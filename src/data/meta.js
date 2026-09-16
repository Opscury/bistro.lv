// Katras lapas nosaukums, apraksts un attēls kopīgošanai. Lieto
// usePageMeta (pārlūkā, mainot lapu) un scripts/prerender.mjs
// (būvējot statisko HTML katram ceļam).

export const SITE_URL = "https://bistro.lv";
export const SITE_NAME = "Silva";

export const routesMeta = {
  "/": {
    title: "Silva — bistro, konditoreja, tējas namiņš un banketi Jelgavā",
    description:
      "Silva Jelgavā kopš 1994. gada: bistro un konditoreja Driksas ielā, tējas namiņš Pasta salā, banketi un telpu noma. Darba laiki, ēdienkartes un kontakti.",
    og: "/og/home.jpg",
  },
  "/bistro": {
    title: "Bistro — Silva, Jelgava",
    description:
      "Pusdienas un brokastis Jelgavas centrā, Driksas ielā 9. Jauna ēdienkarte katru nedēļu, darba dienās 8.00–17.00, brokastis līdz 11.00.",
    og: "/og/bistro.jpg",
  },
  "/konditoreja": {
    title: "Konditoreja — Silva, Jelgava",
    description:
      "Kūkas, tortes, kliņģeri, pīrādziņi, smalkmaizītes un cepumi no Silvas konditorejas Driksas ielā 7, Jelgavā. Piedāvājums ar cenām un pasūtījumi pa tālruni vai e-pastu.",
    og: "/og/konditoreja.jpg",
  },
  "/tejas-namins": {
    title: "Tējas namiņš — Silva, Jelgava",
    description:
      "Tējas namiņš Pasta salā starp Lielupi un Driksu: tējas, kafija, kūkas un saldējuma kokteiļi ar skatu uz upi. Katru dienu 11.00–20.00.",
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
      "Viesību un semināru zāle līdz 90 cilvēkiem Bistro Silva 2. stāvā, pontons un peldterase uz Driksas. Cenas, aprīkojums un ēdināšana.",
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

export function metaFor(pathname) {
  return routesMeta[pathname] || routesMeta["/404"];
}
