# Silva — bistro.lv

Silvas (Jelgava, kopš 1994) vietne: bistro, konditoreja, tējas namiņš,
banketi, telpu noma, kontakti. Vite + React 19 + React Router 7, plain CSS
ar globāliem marķieriem un CSS moduli katrai lapai. Būvējot katrs ceļš
kļūst par gatavu HTML (prerender), attēli dabū mazākas kopijas, un
`sitemap.xml` uzrakstās pats.

## Darbam

```bash
npm install
npm run dev        # http://localhost:5173 (/api, /media, /admin -> lokālais Django :8000)
npm run snapshot   # src/data/*.json no admin API (SNAPSHOT_API=http://127.0.0.1:8000 lokāli)
npm run build      # dist/ — klienta būve + prerender + attēlu kopijas
npm run preview    # rāda dist/ tā, kā to rādīs hostings
npm run menu -- "ceļš/uz/Bistro-edienkarte-15.09.-21.09.pdf"   # nedēļas ēdienkarte
```

`npm run build:spa` būvē bez prerender (tikai ātrai pārbaudei).

## Kas kur

```
index.html                 galva: meta, fonti (preload), slēptās Netlify formas
netlify.toml               būve, galvenes; public/_redirects — vecās adreses, SPA
src/
  main.jsx                 hydrate (prerender) vai render (dev)
  entry-server.jsx         servera ieeja prerender skriptam
  App.jsx                  ceļi + 404
  data/
    lines.json             momentuzņēmums no admin: uzņēmums, vietas, darba laiki, kontakti
    content.json           momentuzņēmums no admin: teksti, foto, galerijas, aktualitātes, nomas cenas
    konditoreja.json       momentuzņēmums no admin: kategorijas, preces, minimumi, alergēni
    lines.js               palīgi: faktu rindas, darba laika formāts, JSON-LD
    menu.json              bistro nedēļas ēdienkartes rindas (izslēgtas) un PDF saites
    konditorejaUnits.js    cenu parsēšana, minimālo daudzumu rezerve
    meta.js                katras lapas <title>, apraksts (fakti no datiem), OG attēls
    site.js                izvēlne; izslēgtās sadaļas "par silvu" teksts
  styles/global.css        fonti (@font-face), marķieri, līniju klasteri
  styles/Page.module.css   kopīgie būvbloki: masthead, fakti, rindas, pogas, formas
  components/              Header, Footer, Layout, Masthead, Img, Gallery, Slideshow,
                           PriceRows, WeeklyMenu, EnquiryForm, konditoreja/*
  pages/                   viena lapa = .jsx + .module.css tikai izkārtojumam
  hooks/                   useCart (grozs), usePageMeta (title/meta pārlūkā)
  lib/                     content.jsx (saturs: momentuzņēmums -> /api), sendForm,
                           features (slēdži), orderSubmit, pickup, analytics
scripts/
  snapshot.mjs             pirms būves: /api/site/ + /api/konditoreja/ -> src/data/*.json
  prerender.mjs            dist/<ceļš>/index.html katram ceļam, 404.html, sitemap
  vite-plugin-img.mjs      attēlu kopijas 320/640 px + __IMG_MANIFEST__
  menu-from-pdf.mjs        PDF -> menu.json
public/
  img/                     attēli (oriģināli līdz 1400 px, WebP)
  menu/                    pusdienas.pdf, brokastis.pdf, dzerieni.pdf (stabili nosaukumi)
  fonts/                   Bricolage Grotesque, Inter, DM Mono (woff2, pašu serverī)
  og/                      kopīgošanas attēli 1200×630
  silva-logo.svg, favicon.svg
docs/                      pārskats un izmaiņu apraksts
```

## Dizaina sistēma

Krēmīgs fons `#fbf7f2`, tinte `#14161c`, otrās pakāpes teksts `#565b69`,
mazais teksts `#61667a` (5.1:1), zaļā `#017a3c` pogām un saitēm,
logotipa zaļā `#019047` tikai kontūrām un fokusa gredzeniem. Bricolage
Grotesque (mazie burti) virsrakstiem, Inter tekstam, DM Mono faktiem un
cipariem. Viss ir `global.css` un `Page.module.css`; lapu moduļi nes tikai
izkārtojumu.

**Līniju klasteri** (zīmola arhitektūra — Configured Hybrid): bistro un
konditoreja ir pati Silva; tējas namiņš un banketi ir Silvas atbalstītas
līnijas ar mazu "Silva · kopš 1994" virs nosaukuma. Katrai lapai ir
`data-cluster="core|teja|banketi"`, un `global.css` tam dod `--line-ground`,
`--line-accent`, `--line-rule`. Šobrīd vērtības ir apzināti tuvas pamatam;
tās aizpilda pēc 2. viļņa koncepta testa — bez pārbūves.

## Kā mainīt saturu

**bistro.lv/admin** — Silvas admin (Django, repozitorijs `silva-api`, serveris
PythonAnywhere; Netlify pārsūta `/admin/*`, `/api/*`, `/media/*`, `/static/*`
un `/menu/*.pdf`). Tur darbinieki maina aktualitātes, darba laikus un
kontaktus, konditorejas preces, galerijas, foto un tekstus. Instrukcija:
`silva-api/docs/instrukcija.md`.

Kā saturs nonāk lapā (`src/lib/content.jsx`):

1. Būvējot `scripts/snapshot.mjs` paņem jaunāko saturu no API un pārraksta
   `src/data/lines.json`, `content.json`, `konditoreja.json`. Ja API nav
   pieejams — brīdinājums, būve turpinās ar esošajiem failiem.
2. Statiskais HTML un pirmā izdruka pārlūkā ir no šiem failiem (nekas
   nelēkā, Google redz pilnu lapu).
3. Pēc ielādes pārlūks pieprasa `/api/site/` (konditorejā arī
   `/api/konditoreja/`) ar 4 s limitu un, ja atbilde ir pareiza, parāda
   jaunāko. Ja API nav, ir lēns vai atbild dīvaini, paliek momentuzņēmums —
   bez kļūdām un "ielādējas". Izmaiņas adminā vietnē redzamas ~1 minūtes laikā.

Bildes: kamēr bilde ir tā pati, kas `public/img/` (API lauks `image.name`),
`<Img>` to rāda no vietnes pašas; adminā nomainītas bildes nāk no `/media/`.

Kodā paliek tikai struktūra: izvēlne, ceļi, dizains, slēdži un izslēgtās
sadaļas (pasūtīšana, banketu forma, "par silvu", nedēļas ēdienkartes rindas).

**Nedēļas ēdienkarte no PDF**: `npm run menu -- fails.pdf` nolasa
   PDF, uzraksta `menu.json` un nokopē PDF uz `public/menu/pusdienas.pdf`.
   Datumus ņem no faila nosaukuma (`…-15.09.-21.09.pdf`) vai
   `--no 2026-09-15 --lidz 2026-09-21`. PDF pirms tam vēlams eksportēt
   ≤ 500 KB (150 dpi) — tagadējie 5 MB faili telefonā veras 15 sekundes.

Ja `validTo` pagājis vairāk nekā nedēļu, bistro lapa pati parāda piezīmi,
ka ēdienkarte ir iepriekšējās nedēļas.

## Formas un pasūtījumi

`src/lib/sendForm.js` sūta Kontaktu ziņu, banketu pieteikumu un
konditorejas pasūtījumu. Trīs režīmi (`.env.example`):

- `VITE_FORM_ENDPOINT=https://…` — jebkurš JSON POST galapunkts;
- `VITE_NETLIFY_FORMS=true` — Netlify Forms (slēptās formas ir `index.html`);
- nekas — atver e-pasta programmu (mailto). Pogas tad saka "Sagatavot vēstuli".

Konditorejas pasūtījumu sistēma (`src/lib/features.js`) ieslēdzas pati,
kad ir formu serveris. Pirms tam jāvienojas, kas atbild uz pasūtījumiem
un cik ātri; `VITE_ORDERING=off` to tur izslēgtu arī ar serveri.

## Attēli

`public/img/` glabā oriģinālus. Būvējot `scripts/vite-plugin-img.mjs`
uzģenerē `vārds-320.webp` un `vārds-640.webp` (kešo
`node_modules/.cache/silva-img/`), un `<Img name="…" sizes="…">` raksta
`srcset` + `width/height`. Jaunam attēlam neko darīt nevajag — nomet
`public/img/` un būvē. Izstrādē (`npm run dev`) kopijas taisa pēc
pieprasījuma.

## Publicēšana

Netlify vai Cloudflare Pages no GitHub repozitorija: `npm run build`,
publicē `dist/`. `public/_redirects` pārsūta vecās WordPress adreses uz
jaunajām un dod SPA rezervi; `dist/404.html` ir īstā 404 lapa. Pēc
pārslēgšanas: Search Console ar `https://bistro.lv/sitemap.xml`, un
24 stundu 404 žurnāla pārbaude.

Vides mainīgie hostingā: skat. `.env.example`.

## Zināmie darbi

Skat. `docs/changes-2026-09.md` (kas izdarīts) un
`docs/site-review-2026-09.md` (pārskats un plāns). Atklātie: produktu
foto pārfotografēšana, alergēnu dati precēm, cenu pārbaude pret aktuālo
cenrādi, e-pasta adreses savā domēnā, `_delete-me/` un
`_source-images-fullsize/` izņemšana no repozitorija.
