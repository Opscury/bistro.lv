// Site-wide content, lifted verbatim from the original bistro.lv pages.

export const nav = [
  { to: "/bistro", label: "BISTRO" },
  { to: "/konditoreja", label: "KONDITOREJA" },
  { to: "/tejas-namins", label: "TĒJAS NAMIŅŠ" },
  { to: "/noma", label: "TELPU NOMA" },
  { to: "/banketi", label: "BANKETI" },
  { to: "/kontakti", label: "KONTAKTI" },
];

export const footerText = "© Bistro SILVA, 2020";

// Home page: six tiles, each a square photo above a caption image.
export const homeTiles = [
  { photo: "sadala_bistro", label: "poga_bistro-1", to: "/bistro", alt: "Bistro" },
  { photo: "sadala_konditoreja", label: "poga_konditoreja-1", to: "/konditoreja", alt: "Konditoreja" },
  { photo: "sadala_banketi", label: "poga_banketi-1", to: "/banketi", alt: "Banketi" },
  { photo: "sadala_tejas_namins", label: "poga_tejas_namins-1", to: "/tejas-namins", alt: "Tējas namiņš" },
  { photo: "sadala_pontons", label: "poga_pontons", href: "https://pontons.lv/", alt: "Pontons" },
  { photo: "sadala_peldterase", label: "poga_peldterase-1", href: "https://peldterase.lv/", alt: "Peldterase" },
];

// Bistro page: three menu cards linking to the PDF menus.
export const bistroMenus = [
  { photo: "bistro_edienkarte", label: "poga_edienkarte-1", pdf: "/menu/Bistro-edienkarte-01.09.-07.09.pdf", alt: "Ēdienkarte" },
  { photo: "bistro_brokastis", label: "poga_brokastis-1", pdf: "/menu/brokastu-edienkarte-no-27.04.26.pdf", alt: "Brokastu ēdienkarte" },
  { photo: "bistro_dzerienkarte", label: "poga_dzerienkarte", pdf: "/menu/dzerienu-karte-2026.pdf", alt: "Dzērienu karte" },
];

export const contact = {
  hours: [
    {
      place: "BISTRO",
      rows: [
        ["Pirmdien-piektdien", "8.00-17.00"],
        ["Sestdien, svētdien", "brīvdiena"],
      ],
    },
    {
      place: "KONDITOREJA",
      rows: [
        ["Pirmdien-piektdien", "9.00-18.00"],
        ["Sestdien", "9.00-16.00"],
        ["Svētdien", "10.00-16.00"],
      ],
    },
    {
      place: "TĒJAS NAMIŅŠ",
      rows: [["Pirmdien-svētdien", "11.00-20.00"]],
    },
  ],
  phones: [
    ["Banketu pasūtījumiem:", "+371 22 00 98 89"],
    ["Konditorejas pasūtījumiem:", "+371 20 20 21 17"],
    ["Tējas namiņš SILVA:", "+371 22 119 119"],
    ["Tālrunis atsauksmēm:", "+371 29 266 586"],
  ],
  addresses: [
    ["Konditoreja – kafejnīca:", "Driksas iela 7, Jelgava, LV-3001, Latvia"],
    ["Bistro:", "Driksas iela 9, Jelgava, LV-3001, Latvia"],
    ["Tējas namiņš:", "Pilssalas iela 2a, Jelgava, LV-3001, Latvia"],
  ],
  emails: [
    ["Banketu un konditorejas pasūtījumiem:", "banketins@inbox.lv"],
    ["Atsauksmēm:", "siaviktorijab@inbox.lv"],
  ],
  requisites: [
    "SIA “Viktorija B”",
    "Konts LV35PARX0012116960003",
    "AS Citadele banka",
    "Reģ. Nr. 43603036429",
  ],
  mapSrc:
    "https://www.google.com/maps?q=Driksas+iela+7,+Jelgava,+LV-3001,+Latvia&output=embed",
};

// Helper: build a numbered list of gallery image names, e.g. seq("kazas_", 37)
const seq = (prefix, n, suffix = ".webp") =>
  Array.from({ length: n }, (_, i) => `${prefix}${i + 1}${suffix}`);

// Helper: inclusive integer range, e.g. range(2, 22) -> [2 … 22]
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
