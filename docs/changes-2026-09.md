# Izmaiņas — 15.–16.09.2026

## 16.09 — pēc Agneses atsauksmēm

- Plakāti atpakaļ: saldējuma plakāts bistro lapā, kokteiļu plakāts tējas
  namiņā (konditorejas saldējuma rindas un tējas namiņa piedāvājuma
  sadaļa izņemtas).
- Adreses, darba laiki un tālruņi vairs nav lapu augšā (masthead) un zem
  sākumlapas kartītēm — tie ir kājenē un Kontaktos.
- Bistro: tikai trīs PDF kartītes kā oriģinālā (bez "spēkā no"). Nedēļas
  ēdienkarte kā rindas paliek gatava — `menu.json` → `lunch.showRows: true`
  (arī /admin), un `npm run menu` to atjauno.
- Konditoreja: rādītājā vairs nav preču skaita un "cenas spēkā no";
  kategoriju josla lapas augšā nav redzama — parādās, kad rādītājs
  aizritināts, un pazūd, atgriežoties.
- Sākumlapā nav "kontakti" noslēguma bloka (kājenē viss ir).
- "Silva · kopš 1994" zīme virs tējas namiņa, banketu un telpu nomas
  nosaukuma izslēgta (kods paliek Masthead.jsx komentārā; `data-cluster`
  uz lapām paliek).
- Banketu pieteikuma forma pagaidām izslēgta (`features.js` →
  `ENQUIRY_FORM_ENABLED`); tās vietā tālrunis, e-pasts un poga uz Kontaktiem.


Ieviests pārskata plāns (`docs/site-review-2026-09.md`), 0.–3. fāze pilnībā un
4. fāzes āķi. Pieņemtie lēmumi: palaist tagad (līniju atšķirības kā
pārslēdzami marķieri, vērtības pēc 2. viļņa); pasūtījumi ieslēdzas paši, kad
formām ir serveris; nedēļas rediģēšanai ir CMS un skripts; pontons un
peldterase ir vietas pasākumiem zem banketiem; domēns paliek bistro.lv, viss
uz tā saka "Silva".

## Kas jāizdara jums pirms palaišanas

1. `npm install` (jaunas atkarības: sharp, pdfjs-dist), tad `npm run build`
   un `npm run preview` — jāatveras visām lapām, /admin un /nekas (404).
2. **Cenas.** `src/data/konditoreja.json` cenas ir no vecās vietnes — pārbaudīt
   pret aktuālo cenrādi un nomainīt `pricesValidFrom`.
3. **Hostings.** Netlify vai Cloudflare Pages no GitHub. Vides mainīgie pēc
   `.env.example`: `VITE_NETLIFY_FORMS=true` (Netlify) vai
   `VITE_FORM_ENDPOINT`. Bez tiem formas atver e-pasta programmu un
   pasūtījumu sistēma paliek izslēgta.
4. **Kas atbild uz pasūtījumiem un pieteikumiem** (banketins@inbox.lv) —
   pirms formu servera ieslēgšanas jāvienojas par atbildēšanas laiku.
5. **CMS** (ja rediģēs kāds Silvā): Netlify → Identity (Invite only) +
   Git Gateway, uzaicināt redaktorus; tad `https://bistro.lv/admin/`.
6. Pēc pārslēgšanas: Search Console + `https://bistro.lv/sitemap.xml`,
   trīs Google Business Profile ar tiem pašiem darba laikiem.
7. **Dzēst** (šoreiz nevarēju — mape nebija pieejama no čaulas):
   `_delete-me/`, `dist/Claude outputs/`, vecos PDF
   `public/menu/Bistro-edienkarte-01.09.-07.09.pdf`,
   `brokastu-edienkarte-no-27.04.26.pdf`, `dzerienu-karte-2026.pdf`
   (tagad ir `pusdienas.pdf`, `brokastis.pdf`, `dzerieni.pdf`), un
   `public/img/silva_logo.webp` vairs nav vajadzīgs (SVG). `.gitignore`
   jau izslēdz `_delete-me/`, `_source-images-fullsize/`, `dist/`.

## Atklātie darbi (2. fāze — saturs)

- Produktu foto pārfotografēšana (viens fons, divi leņķi, 118 preces).
  Līdz tam preces stāv vienāda izmēra kastēs; izgriezumi paliek, kādi ir.
- Alergēni un īpašības precēm — `konditoreja.json` vai /admin; kamēr
  nav, rindā ir "vairāk" un preces logā vispārēja piezīme.
- Tējas namiņa piedāvājums ar cenām (tagad kategorijas bez cenām un
  kokteiļi ar cenu).
- Banketu galeriju izlase: `featured` rāda pirmos 4 no katras kopas — vērts
  pārkārtot `site.js` galeriju sarakstus tā, lai labākie ir pirmie.
- E-pasta adreses savā domēnā (banketi@, konditoreja@, info@bistro.lv);
  tad nomainīt `lines.json` un `konditoreja.json`.
- Teksti latviski ("par Silvu", banketu soļi, tējas namiņš) ir mans
  melnraksts — pārlasīt.
- Tējas namiņa galerijas faili joprojām ar Facebook nosaukumiem
  (`243208899_…`) — pārsaukt un atjaunot `site.js`.

## Kas mainījies, pa failiem

**Dati — viens avots**
- `src/data/lines.json` (jauns): uzņēmums, četras vietas ar adresēm, darba
  laikiem (mašīnlasāmi), tālruņiem, e-pastiem, klasteri; vietas pasākumiem.
- `src/data/lines.js` (jauns): faktu rindas, darba laika formāts
  ("P.–Pk. 8.00–17.00" / "Pirmdien–piektdien"), karšu saites, JSON-LD.
- `src/data/menu.json` (jauns): pusdienu ēdienkarte kā HTML rindas
  (10 sadaļas, 113 ēdieni, dienas zupas ar datumiem, "veselīgāk" atzīmes),
  brokastis un dzērieni kā PDF ar derīguma datumiem.
- `src/data/konditoreja.json`: kategorijas normālā rakstībā, `classic` trim
  precēm (Vēja zirdziņš, Speķa pīrādziņš, Aveņu laiviņa), `pricesValidFrom`,
  tālrunis/e-pasts/dienas, saldējums (no bistro plakāta).
- `src/data/meta.js` (jauns): katrai lapai title, description, OG attēls.
- `src/data/site.js`: izvēlne no lines.json, teksti, galerijas.

**Lapas**
- Sākumlapa: "Silva · Jelgava · kopš 1994" virs virsraksta; četras līnijas
  klasteru secībā (bistro, konditoreja / tējas namiņš / banketi);
  "par Silvu"; "vietas pasākumiem" (zāle, pontons, peldterase); izvēlne
  tādā pašā secībā.
- Bistro: nedēļas ēdienkarte kā rindas + PDF, brokastis un dzērieni,
  grupu ēdināšana ar saiti uz pieteikumu; plakāts aizstāts ar rindām.
- Konditoreja: fakti mastheadā, rādītājs ar skaitiem, lipīga kategoriju
  josla, "silvas klasika", "vairāk"/"sastāvs" pēc datu esamības, vienādas
  foto kastes, saldējuma rindas, "cenas spēkā no", alergēnu piezīme.
- Tējas namiņš: "Silva · kopš 1994" (atbalstītā līnija), piedāvājuma
  sadaļa, kokteiļi kā rindas, galerija ar lielo skatu.
- Banketi: "kā tas notiek" (3 soļi), pasākumi un vietas, galerijas
  (4 + lielais skats), pieteikuma forma (datums, viesi, veids, vieta).
- Telpu noma: no lines.json, pontons/peldterase ar galerijām, pogas uz
  pieteikumu.
- Kontakti: viss no lines.json; Google Maps / Waze saites katrai adresei;
  kartes iframe izņemts; forma caur sendForm.
- 404 lapa (`NotFound.jsx`), arī `dist/404.html`.

**Sistēma**
- `global.css`: fonti pašu serverī (`public/fonts`), `--c-ink-3` 5.3:1,
  `--c-orn` tikai rotājumiem, 16px teksts, `--header-h`, `--sticky-extra`,
  klasteru marķieri `--line-*` un `[data-cluster]`.
- `Page.module.css`: fakti 14px ar 24px saitēm, eyebrow, soļi, čipu josla,
  tagi, formas, "papīra" lapiņa — viena kopija visam.
- `Home.module.css`, `Konditoreja.module.css`: tikai izkārtojums; dublējumi
  un `--k-*` slānis izņemti.
- Galvene: SVG logotips, Escape aizver, klikšķis ārpusē aizver, ✕ stāvoklis,
  mēra savu augstumu.
- Kājene: četras vietas ar adresēm/laikiem, Instagram, "kopš 1994",
  aprēķināts gads, rekvizītu saite.
- `Img.jsx` + `scripts/vite-plugin-img.mjs`: srcset 320/640 + oriģināls,
  width/height, kopijas būvējot un dev režīmā.
- `Gallery.jsx` (režģis + lielais skats), `Slideshow.jsx` (DOM-ā tikai
  pašreizējais ± 1 slaids) — Banketi 132 pieprasījumi → 28.
- `lib/sendForm.js`: serveris / Netlify Forms / mailto; `features.js`:
  pasūtījumi ieslēdzas ar serveri; `analytics.js`: Plausible pēc izvēles.
- `hooks/usePageMeta.js`: title/meta/canonical/og pārlūkā;
  `scripts/prerender.mjs`: statisks HTML katram ceļam, 404.html, sitemap.
- `index.html`: meta, OG, fontu preload, slēptās Netlify formas, Identity
  novirzīšana uz /admin.
- `public/`: `_redirects` (vecās adreses, SPA), `robots.txt`, `og/*.jpg`,
  `silva-logo.svg`, `favicon.svg`, `admin/` (Decap), `fonts/`, `menu/`
  ar stabiliem nosaukumiem (PDF saspiesti: 5.2 MB → 0.9 MB, 5.1 → 0.5).
- `netlify.toml`, `.env.example`, `.gitignore`, `README.md` pārrakstīts.
- `scripts/menu-from-pdf.mjs`: `npm run menu -- fails.pdf`.

## Mērījumi (lokāla būve, Playwright)

- Katrai lapai savs title/description/canonical/og, JSON-LD organizācijai
  un trim vietām, sitemap ar 7 URL; nezināms ceļš → 404 ar galveni.
- Banketi: 132 → 28 attēlu pieprasījumi atverot; Konditoreja 26.
- Kontrasts: ink-3 5.3:1, ink-2 6.4:1, zaļā 5.1:1 uz visiem foniem.
- Nav hidratācijas kļūdu, nav konsoles kļūdu, nav horizontālas ritināšanas
  390 px platumā.
