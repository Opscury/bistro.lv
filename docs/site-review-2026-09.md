# Silva site review — 15.09.2026

Review of the React rebuild of bistro.lv (`silva-site`, branch main): 7 routes, 118 products, 317 images. Method: full read of `src/`, `index.html`, README and git history; the six screenshots in `dist/Claude outputs`; a local production build served with `vite preview` and audited with Playwright at 1280 px and 390 px (network, DOM, titles, 404, keyboard); contrast computed from token values; live bistro.lv fetched for comparison. The shareable version of this document is the "Silva Site Review" artifact.

## Verdict

The system rolled out from the Konditoreja page — cream ground, ink rules, lowercase Bricolage Grotesque, DM Mono facts, dotted leaders — is confident and consistent across all seven pages, a level above the WordPress site still live at bistro.lv. Keep it. Four things stand between this and a site that does its job:

1. **It expresses a Branded House, not the Configured Hybrid.** Every line gets the same masthead, type, photo treatment and copy register; the two external venues (pontons.lv, peldterase.lv) get home-page cards equal to the four lines; the master brand is silent (no "par Silvu", no 1994; footer says "Bistro SILVA").
2. **Konditoreja is undermined by two fixable things.** Flood-filled product cut-outs (doily fragments, halos, one grey rectangle) and a "sastāvs" link on all 118 rows with `allergens: null`, `diet: null` behind every one.
3. **Launch blockers.** One `<title>` for all routes, no descriptions/OG, blank page on unknown URLs, both forms via `mailto:`, 16.4 MB of images loaded on Banketi before scrolling, Google Fonts + Maps iframe pre-consent.
4. **No update path.** Hours in four places, the weekly lunch menu is a dated PDF filename in code, prices scraped from the 2020-era site, footer says 2020.

## What to keep

The design tokens and `Page.module.css`; content-as-data (`site.js`, `konditoreja.json`); the ordering flow's bones (feature flag, localStorage cart with catalogue validation, price parser, category minimums, "request not purchase" framing); the masthead pattern (one lowercase word + mono facts line); accessibility basics (skip link, focus ring, dialog semantics, slideshow keyboard/live counter, `alt=""` on decorative thumbs); the Noma price rows with leaders; the WebP pipeline; the untouched, scaled-not-squashed logo with green reserved for outlines.

## Findings

### Brand & structure (against the locked Configured Hybrid decision)

1. **Uniform treatment where three clusters were decided** (major). No secondary visual layer at all; the current register also sits closest to Concept 3 "Refined Silva" — relevant before Wave 2. *Fix:* per-line token layer (`--line-accent`, ground tint, masthead variant, photo direction, copy register) applied at three levels (core pair / tējas namiņš / banketi) plus an endorsement lockup on the two endorsed lines; build hooks now, fill values after Wave 2. — `Page.module.css`, page modules, `Header.jsx`
2. **Home grid, nav and architecture disagree** (major). Nav: bistro · konditoreja · tējas namiņš · telpu noma · banketi · kontakti. Home: bistro · konditoreja · banketi · tējas namiņš · pontons · peldterase. *Fix:* home = four lines in cluster order + one "vietas pasākumiem" block (zāle, pontons, peldterase) under Banketi; match nav order. — `site.js`, `Home.jsx`
3. **The master brand never speaks** (major). No "par Silvu", no "kopš 1994", no visible "Jelgava"; footer "© Bistro SILVA, 2020". *Fix:* short "par Silvu" on home; "Silva · Jelgava · kopš 1994" in footer; "Silva" everywhere, SIA Viktorija B only in rekvizīti. — `site.js`, `Home.jsx`, `Footer.jsx`
4. **Heritage anchors unmarked** (minor). Vēja zirdziņš, Aveņu laiviņa, speķa pīrādziņi are listed like everything else. *Fix:* `classic: true` in JSON → "silvas klasika" mono tag on row + line in sheet. — `konditoreja.json`, `Konditoreja.jsx`, `ItemSheet.jsx`
5. **One copy register for three registers** (major). Banketi generic; Tējas namiņš two paragraphs, no menu; Bistro one sentence; no page says how to buy. *Fix:* copy pass — plain/practical core pair; place-led warm Tējas namiņš with tea list; service-led formal Banketi (3-step process, capacities, lead times, delivery radius).
6. **Two flyer graphics break the system** (major). Ice-cream poster (Bistro, headed "Konditorejā") and milkshake poster (Tējas namiņš) — pastel, baked-in uppercase type. *Fix:* rebuild as price rows in the system; move ice cream to Konditoreja. — `Bistro.jsx`, `TejasNamins.jsx`
7. **inbox.lv addresses on a 30-year brand** (minor). *Fix:* banketi@, konditoreja@, info@ on bistro.lv, forwarding to existing inboxes.

### Konditoreja (10 categories, 118 items, 15 193 px tall on desktop)

1. **Product cut-outs read as pasted** (critical). Flood-fill left doilies/halos (Vēja zirdziņš, Kanēļa, most kliņģeri) and a grey rectangle (Ābolu, banānu, brūkleņu); scale, angle, light vary. *Fix:* reshoot — one day, one backdrop, two angles, same distance/light, 118 items; until then fixed thumbnail box with consistent scale and masking of the worst twenty. Biggest single lever on the site.
2. **"sastāvs" ×118, delivered 0 times** (critical). Sheet shows a placeholder for every item. *Fix:* collect the 14 EU allergens (Reg. 1169/2011) per item from the konditoreja; until then hide the link and show one general note per category; diet badges only where true. — `konditoreja.json`, `MenuRow`, `ItemSheet.jsx`
3. **Dotted leaders that lead nowhere** (minor). Index leaders were meant to end in an item count. *Fix:* add count or minimum order, or drop leaders. — `MenuIndex`
4. **15 000 px page with one index at the top** (major). Only "↑ piedāvājums" (19 px tall) to get back. *Fix:* sticky compact category bar (horizontal chips on mobile) with current-section highlight; top index as two-column chips.
5. **Uppercase category names and ambiguous duplicates** (minor). "SALDIE KLIŅĢERI" in JSON; Tradicionālais ×2, Sāļais ×2, Medus torte ×2 differ only by hidden-on-mobile desc. *Fix:* normal case in data; fold desc into name or keep `rowDesc` visible on mobile.
6. **Order flow built, switched off, would post via mailto** (major). *Fix:* real POST endpoint inside `sendOrder` (Netlify/Cloudflare form or small worker → banketi@), reuse for Kontakti, then flip `ORDERING_ENABLED` once someone owns the inbox and a response time. — `features.js`, `orderSubmit.js`, `Kontakti.jsx`
7. **Prices scraped from the old site, unverified** (critical). *Fix:* reconcile all 118 against the current price list before launch; "cenas spēkā no dd.mm.yyyy" line; optional `priceUpdated` per item.

### Performance (local production build)

1. **Banketi loads 16.4 MB before anyone scrolls** (critical). All slides rendered stacked, so `loading="lazy"` never applies: 131 gallery images requested on open; Noma 27 (3.8 MB). *Fix:* render current ± 1 slide in `Slideshow.jsx`, or curated grid + lightbox.
2. **No responsive sizes** (major). 1080–1400 px files shown at 88–330 px; no `srcset`/`sizes`; all product images = 8 MB. *Fix:* build-time 320/640/1080 variants (vite-imagetools), thumbs ≤ 400 px.
3. **Menus are 5 MB PDFs** (major). Lunch 5.2 MB, breakfast 5.1 MB, drinks 92 KB. *Fix:* export ≤ 500 KB or HTML menu.
4. **Raster logo and favicon** (minor). 1400×700 WebP at 104 px; 512 px PNG favicon. *Fix:* SVG wordmark + SVG favicon.
5. **Google Fonts from a third-party origin** (major, GDPR). Three-axis Bricolage + DM Mono + Inter from fonts.googleapis.com. *Fix:* self-host woff2 (fontsource), preload display face, trim weights; update README (still says Inter + Raleway).
6. **Client-only rendering for a brochure** (minor). 325 KB JS (100 KB gz); empty root until React runs. *Fix:* prerender the seven routes (vite-react-ssg / React Router prerender).

### Upkeep & code

1. **Hours and phones live in four places** (major). `homeSections.meta`, `contact.hours`, hardcoded in `Bistro.jsx`/`TejasNamins.jsx`/`Banketi.jsx`/`Konditoreja.jsx`/`orderSubmit.js`, in differing formats. *Fix:* one `lines` object (id, name, address, hours, phone, email, mapUrl, cluster) that home, mastheads, Kontakti, footer and JSON-LD derive from.
2. **The weekly menu requires a developer** (critical). `bistroMenus[0].pdf` is a dated filename in source. *Fix now:* stable paths + `validFrom/validTo`. *Fix properly:* Decap CMS on the repo (or sheet-driven build) scoped to menu, prices, hours/holidays, items, galleries.
3. **One-line footer on a four-location business** (minor). *Fix:* lines with address/hours, key phones, Instagram, "Silva · Jelgava · kopš 1994", SIA Viktorija B, computed year.
4. **Repository hygiene** (minor). `_delete-me/`, `_source-images-fullsize/` (202 MB), `dist/` in tree; README outdated; Tējas namiņš gallery files carry Facebook CDN names. *Fix:* delete/move/ignore/rename; rewrite README.
5. **Two copies of the system** (minor). `Home.module.css` and `Konditoreja.module.css` (22 KB) re-declare title/heading/cta/btn/facts; `--k-*` alias layer, empty "zīmogs" section, duplicated `color`/`font-weight` declarations. *Fix:* consolidate onto `Page.module.css`.

### Launch & SEO (old WordPress site still live)

1. **One title for every page, no descriptions, blank 404** (critical). *Fix:* `usePageMeta` per route, OG image per line, sitemap + robots, NotFound route in Layout; prerender.
2. **No structured data for three locations** (major). *Fix:* JSON-LD from `lines` — Organization (foundingDate 1994) + Bakery / Restaurant / CafeOrCoffeeShop with `openingHoursSpecification`, geo, telephone; align the three Google Business Profiles.
3. **Cut-over from WordPress** (critical). Trailing slashes, `/wp-content/uploads/…` URLs, SPA rewrite. *Fix:* deploy from repo to Netlify/Cloudflare Pages; `_redirects`; Search Console before switch; 404 log check after.
4. **No analytics** (minor). *Fix:* Plausible/Umami; events for PDF opens, phone taps, form submits — feeds the customers/channels block of the branch analysis.
5. **One map, one address, pre-consent** (minor). Undocumented `maps?q=` iframe, Driksas 7 only. *Fix:* static map or none + "Atvērt kartē" deep links (Google/Waze) per address.

### Accessibility & detail

1. **`--c-ink-3` slipped under AA** (major). #6e7382 on #FBF7F2 = 4.44:1 (was 4.61:1 on the earlier #FFFCF2 ground); used on 11–13 px text. *Fix:* ≈ #61667a (5.1:1) or `--c-ink-2` for all text; ink-3 for leaders/arrows only.
2. **The most important text is the smallest** (major). Facts line 12.5 px mono; phone/e-mail links 14 px tall (WCAG 2.5.8: 24 px); body 15.27 px. *Fix:* facts 14 px, padded links, body 16 px.
3. **"Skip to content" in English** (minor) → "Pāriet uz saturu". — `Layout.jsx`
4. **Mobile menu ignores Escape, never becomes ✕** (minor). *Fix:* Escape closes + returns focus; open state animates bars; close on outside tap.
5. **"1 / 37" is a chore** (minor). *Fix:* curate 6–8 per event type, grid + lightbox.
6. **Small things.** "P.–Pk." vs "Pirmdien–piektdien"; Kontakti success state says "ziņa sagatavota" regardless; "Grupu ēdināšana" has nothing to do; Tējas namiņš has no menu; make the hidden "Silva, Jelgava:" H1 prefix visible.

## The plan

Effort = one developer who knows the codebase; content items run in parallel.

### Phase 0 — launch blockers (2–3 dev days; replaces the WordPress site)

| Item | Effort | Ref |
| --- | --- | --- |
| Per-route title + description, OG image, NotFound route, sitemap, robots | ½ day | seo 1 |
| Real form endpoint for Kontakti (ready for orders) | ½ day | kond 6 |
| Slideshow renders current ± 1 (Banketi 16 MB → < 1 MB) | 2 h | perf 1 |
| Self-host fonts; PDFs ≤ 500 KB | 2 h | perf 3, 5 |
| Verify all 118 prices; "cenas spēkā no" | yours | kond 7 |
| Hide "sastāvs" until allergen data exists | 1 h | kond 2 |
| ink-3 contrast, facts size, skip-link text, footer year and "Silva" | 2 h | a11y 1–3, brand 3 |
| Deploy from repo, `_redirects`, SPA rewrite, Search Console | ½ day | seo 3 |

### Phase 1 — structure & quick wins (1 week)

| Item | Effort | Ref |
| --- | --- | --- |
| One `lines` object; mastheads, home, Kontakti, footer, JSON-LD derive from it | 1 day | ops 1, seo 2 |
| Home grid = four lines in cluster order + "vietas pasākumiem"; nav matched | ½ day | brand 2 |
| "Par Silvu", "kopš 1994", full footer with NAP + Instagram | ½ day + copy | brand 3, ops 3 |
| Responsive image variants + SVG logo/favicon | 1 day | perf 2, 4 |
| Konditoreja: index values, sticky category bar, normal-case names, "silvas klasika" | 1 day | kond 3–5, brand 4 |
| Posters → price rows; ice cream to Konditoreja | 2 h | brand 6 |
| Branded e-mails; map deep links; analytics; mobile-nav fixes | ½ day | brand 7, seo 4–5, a11y 4 |
| CSS consolidation; repo cleanup; README | ½ day | ops 4–5 |

### Phase 2 — content & photography (2–4 weeks, in parallel; mostly inside the company)

| Item | Effort | Ref |
| --- | --- | --- |
| Product reshoot (one backdrop, two angles, 118 items), swap files | 1 shoot day + 1 dev day | kond 1 |
| Allergen + diet data per item; re-enable "sastāvs" | 1 afternoon + 2 h | kond 2 |
| Copy pass in three registers; Banketi process/capacities/lead times; Tējas namiņš menu | copy | brand 5 |
| Banketi enquiry form: date, guests, event type, venue, budget range | ½ day | brand 5 |
| Curated galleries (6–8 per type) with lightbox | ½ day + selection | a11y 5 |

### Phase 3 — the update path (1 week)

| Item | Effort | Ref |
| --- | --- | --- |
| Stable menu paths + validFrom/validTo now; then Decap CMS or sheet-driven build | 2–3 days | ops 2 |
| Weekly lunch menu as HTML rows (PDF as download) | 1 day | perf 3 |
| Switch `ORDERING_ENABLED` on with a named owner and response time | 1 h + ops decision | kond 6 |
| Prerender routes at build | ½ day | perf 6 |

### Phase 4 — the architecture layer (after Wave 2, Dec 2026 onward)

| Item | Effort | Ref |
| --- | --- | --- |
| Per-cluster tokens filled from the winning concept | 1–2 days | brand 1 |
| Endorsement lockup on Tējas namiņš and Banketi | ½ day | brand 1 |
| The site as one applied output on the A1 boards | design | thesis |

## Decisions for Agnese

1. **Launch before or after Wave 2?** Intercepts start ~mid-November; a live site exposes respondents to a register close to Concept 3. *Read:* launch phases 0–1 now (concept-neutral work, current look is good enough), note the exposure as a field condition in chapter 10, keep tokens swappable, apply the winner in phase 4.
2. **Switch ordering on at launch?** *Read:* launch with phone/e-mail, wire the endpoint in phase 0, switch on in phase 3 with a named owner and stated response time.
3. **Who edits the site each week?** If Valdis, phase 3 can wait; if someone at Silva, phase 3 makes launch safe. Decide now — it determines HTML menu vs PDF upload.
4. **Are Pontons and Peldterase Silva?** *Read:* venues Silva caters, grouped under Banketi with outbound links — unless the family sees them as lines, in which case the architecture has a fifth and sixth member.
5. **bistro.lv as the master-brand domain?** *Read:* keep the domain (links, habit, Google history); everything on it says Silva.
