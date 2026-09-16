# Silva — bistro.lv

Silvas (Jelgava, kopš 1994) vietne: bistro, konditoreja, tējas namiņš,
banketi, telpu noma, kontakti. Vite + React 19 + React Router 7, plain CSS
ar globāliem marķieriem un CSS moduli katrai lapai. Būvējot katrs ceļš
kļūst par gatavu HTML (prerender), attēli dabū mazākas kopijas, un
`sitemap.xml` uzrakstās pats.

## Darbam

```bash
npm install
npm run dev        # http://localhost:5173
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
    lines.json             VIENS AVOTS: vietas, adreses, darba laiki, tālruņi, e-pasti
    lines.js               palīgi: faktu rindas, darba laika formāts, JSON-LD
    menu.json              bistro ēdienkartes (nedēļas HTML rindas + PDF, brokastis, dzērieni)
    konditoreja.json       118 preces 10 kategorijās, klasika, cenu datums, saldējums
    konditorejaUnits.js    cenu parsēšana, minimālie daudzumi
    meta.js                katras lapas <title>, apraksts, OG attēls
    site.js                izvēlne, teksti, galeriju saraksti
  styles/global.css        fonti (@font-face), marķieri, līniju klasteri
  styles/Page.module.css   kopīgie būvbloki: masthead, fakti, rindas, pogas, formas
  components/              Header, Footer, Layout, Masthead, Img, Gallery, Slideshow,
                           PriceRows, WeeklyMenu, EnquiryForm, konditoreja/*
  pages/                   viena lapa = .jsx + .module.css tikai izkārtojumam
  hooks/                   useCart (grozs), usePageMeta (title/meta pārlūkā)
  lib/                     sendForm (formu transports), features (slēdži),
                           orderSubmit, pickup, analytics
scripts/
  prerender.mjs            dist/<ceļš>/index.html katram ceļam, 404.html, sitemap
  vite-plugin-img.mjs      attēlu kopijas 320/640 px + __IMG_MANIFEST__
  menu-from-pdf.mjs        PDF -> menu.json
public/
  img/                     attēli (oriģināli līdz 1400 px, WebP)
  menu/                    pusdienas.pdf, brokastis.pdf, dzerieni.pdf (stabili nosaukumi)
  fonts/                   Bricolage Grotesque, Inter, DM Mono (woff2, pašu serverī)
  og/                      kopīgošanas attēli 1200×630
  admin/                   Decap CMS (satura rediģēšana bez koda)
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

Trīs ceļi, no vienkāršākā:

1. **/admin** (Decap CMS) — formas, kas raksta `src/data/*.json` tieši
   GitHub repozitorijā; katrs saglabājums = jauna būve. Jāieslēdz vienreiz
   Netlify: Identity (Invite only) + Git Gateway, tad uzaicina redaktorus.
2. **JSON faili** `src/data/` — darba laiki (`lines.json`), ēdienkartes
   (`menu.json`), preces un cenas (`konditoreja.json`). Pēc labošanas —
   commit, hostings pārbūvē.
3. **Nedēļas ēdienkarte no PDF**: `npm run menu -- fails.pdf` nolasa
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
