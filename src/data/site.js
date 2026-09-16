// Vietnes saturs, kas nav vietu fakti (tie ir lines.json) un nav
// konditorejas piedāvājums (konditoreja.json) vai bistro ēdienkartes
// (menu.json). Galeriju attēlu saraksti un tējas namiņa piedāvājums.

import { lines, venues } from "./lines.js";

// Izvēlne — tādā pašā secībā kā sākumlapa: bistro un konditoreja
// (Silvas ikdienas pāris), tējas namiņš, banketi, tad vietas un kontakti.
export const nav = [
  ...lines.map((l) => ({ to: l.path, label: l.name })),
  { to: "/noma", label: "Telpu noma" },
  { to: "/kontakti", label: "Kontakti" },
];

// Sākumlapas masthead — Silvas diena piecos vārdos.
export const homeTitle = "brokastis, pusdienas, kūkas, tēja un svinības";

// Sākumlapa: "par Silvu". Fakti no lines.json (company), teksts šeit.
export const aboutText = [
  "Silva ir ģimenes uzņēmums Jelgavā kopš 1994. gada. Viena virtuve gatavo visām četrām vietām — bistro un konditorejai Driksas ielā, tējas namiņam Pasta salā un banketiem tur, kur tie notiek.",
  "Vai tās ir pusdienas darba dienā, kūka svētkiem vai galds simts viesiem — mērķis nemainās: plaša izvēle un kvalitāte, uz kuru var paļauties.",
];

// Bistro: grupu ēdināšana (bloks bez cenām — pēc pieprasījuma) un
// saldējuma plakāts.
export const bistroGroups = {
  photo: "grupu_edinasana_bilde.webp",
  title: "Grupu ēdināšana",
  note: "Pēc pieprasījuma",
  alt: "Klāts galds bistro zālē pie loga",
  text: "Ekskursiju grupām, kolektīviem un sapulcēm — pusdienas bistro zālē vai izbraukumā. Sastādām piedāvājumu pēc jūsu grupas lieluma un laika.",
};

export const bistroPoster = {
  photo: "Saldejums-konditoreja.webp",
  alt: "Konditorejā: vaniļas saldējums vafeļu konusā 1.50 € / 65 g, trauciņā 1.95 € / 150 g; saldējuma kokteilis (sula pēc izvēles) 4.00 € / 400 ml",
};

// Tējas namiņš: ievads, plašais foto un kokteiļu plakāts.
export const tejasOffer = {
  intro: [
    "Omulīgs tējas namiņš Pilssalas ielā 2A starp Lielupi un Driksu, kur baudīt dažādas tējas, kafiju, saldējumu, gardas kūkas un smalkmaizītes. Ir neliels, bet pārdomāts karsto ēdienu piedāvājums.",
    "No namiņa paveras skaists skats uz pilsētu, upi un upes strūklakām. Visu gadu var sēdēt arī pie āra galdiņiem.",
  ],
  wideShot: "tejas_namins_1_1-6.webp",
  poster: {
    photo: "Saldejuma-kokteili.webp",
    alt: "Saldējuma–piena kokteiļi, 6.00 € / 350 ml: bubble gum, šokolādes, karameļu, matcha, zemeņu, oreo",
  },
};

// Banketi: kā tas notiek, pasākumu veidi, kur.
export const banketiSteps = [
  {
    title: "Sazinieties",
    text: "Pastāstiet par pasākumu — datums, viesu skaits, vieta un tas, kas jums svarīgi.",
  },
  {
    title: "Piedāvājums",
    text: "Sastādām ēdienkarti un tāmi tieši jūsu pasākumam; pielāgojam, kamēr viss der.",
  },
  {
    title: "Apstiprinājums",
    text: "Saskaņojam detaļas, laiku un noformējumu. Pasākuma dienā par galdu rūpējamies mēs.",
  },
];

export const banketiEvents = [
  "kāzas", "bildināšanas", "kristības", "jubilejas", "atvadu mielasti",
  "korporatīvie pasākumi", "semināri un konferences", "kafijas pauzes", "prezentācijas",
];

export const banketiVenueNote =
  "Bistro Silva zālē Jelgavas centrā, uz pontona vai peldterases, vai jebkurā citā jums vēlamā vietā — pilī, meža būdiņā, uz ūdens vai citur. Piedāvājumā plates, uzkodas, pamatēdieni, salāti, zupas, karstās uzkodas, dzērieni un pašu konditorejas izstrādājumi; pēc iepriekšējas vienošanās arī piegāde.";

export { venues };

// Banketu galerijas — nosaukumi un attēli. `featured` ir tie, ko rāda
// režģī (6 gab.); pārējie atveras lielajā skatā.
const seq = (prefix, n, suffix = ".webp") =>
  Array.from({ length: n }, (_, i) => `${prefix}${i + 1}${suffix}`);
const range = (from, to) =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i);

export const galleries = {
  banketuZale: seq("banketu_zale_", 6),
  pontons: [
    "pontons_1", "pontons_2", "pontons_3", "pontons_14", "pontons_5",
    "pontons_6", "pontons_13", "pontons_7", "pontons_8", "pontons_9",
    "pontons_10", "pontons_11", "pontons_12",
  ].map((n) => `${n}.webp`),
  peldterase: [
    "peldterase_1", "peldterase_2", "peldterase_3-1", "peldterase_4",
    "peldterase_5", "peldterase_6", "peldterase_7", "peldterase_8",
  ].map((n) => `${n}.webp`),
  jubilejas: ["jubilejas_1-1.webp", ...range(2, 22).map((i) => `jubilejas_${i}.webp`)],
  kazas: [
    ...range(1, 11).map((i) => `kazas_${i}-1.webp`),
    ...range(12, 37).map((i) => `kazas_${i}.webp`),
  ],
  korporativie: seq("korporativie_", 28),
  kafijasPauzes: seq("kafijas_pauzes_", 16),
  brokastis: seq("brokastis_", 11),
  atvaduMielasts: seq("atvadu_mielasts_", 12),
  salsmaize: ["salsmaize_1-1.webp", "salsmaize_2.webp", "salsmaize_3.webp", "salsmaize_4.webp", "salsmaize_5.webp"],
  tejasNamins: [
    "243208899_4710946462290652_2426781371163989117_n",
    "330165875_983817183025593_2523595188960381527_n",
    "331574458_1455555541918629_5994029961482183590_n",
    "336388605_770109118042965_7420357224456658501_n",
    "405766772_1130783288191824_5830210323067750076_n",
    "423312652_1186739902596162_8584439747643006005_n",
    "435696566_1224817422121743_8603174521388951275_n",
    "448181453_1270366787566806_6680653767805566037_n",
  ].map((n) => `${n}.webp`),
};

export const banketiGalleries = [
  { key: "jubilejas", title: "Jubilejas" },
  { key: "kazas", title: "Kāzas" },
  { key: "korporativie", title: "Korporatīvie pasākumi" },
  { key: "kafijasPauzes", title: "Kafijas pauzes" },
  { key: "brokastis", title: "Brokastis" },
  { key: "atvaduMielasts", title: "Atvadu mielasts" },
  { key: "salsmaize", title: "Sālsmaize" },
];
