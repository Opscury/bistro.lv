# Silva — bistro.lv rebuild

A faithful rebuild of **bistro.lv** (Bistro SILVA, Jelgava) as a React app.
The original was a WordPress site on the *Assembler* theme; this is a plain
Vite + React + React Router single-page app with no CMS behind it yet.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run preview  # serve the production build
```

## What's where

```
index.html                 loads Inter + Raleway from Google Fonts
src/
  main.jsx                 entry point, mounts BrowserRouter
  App.jsx                  the seven routes
  styles/global.css        design tokens (colours, widths, type scale) + shared classes
  components/
    Layout.jsx             header + <Outlet/> + footer
    Header.jsx             sticky nav, collapses to a burger menu under 900px
    Footer.jsx
    Slideshow.jsx          replaces the Jetpack slideshow block
    ScrollToTop.jsx        resets scroll on route change, honours #anchors
  pages/                   one .jsx + one .module.css per page
  data/
    site.js                nav, contact details, gallery image lists, page copy bits
    konditoreja.json       118 products across 10 categories, extracted from the original
public/
  img/                     317 images, resized to max 1400px and converted to WebP
  menu/                    the three PDF menus
```

Styling is plain CSS: one `global.css` for tokens and shared bits, and a CSS
Module next to each component so class names can't collide.

## Design tokens

Lifted from the original site, so colours and spacing match:

| Token | Value | Used for |
| --- | --- | --- |
| `--c-green-pale` | `#e6f4ec` | info panels, product cards, separators, footer |
| `--c-green-dark` | `#004823` | buttons |
| `--c-amber` | `#f7b05b` | button hover |
| `--c-text` | `#1e1e1e` | body text |
| `--c-brown` | `#4e342e` | the "minimum order" notes |
| `--w-wide` | `1080px` | the main content column |
| `--w-content` | `620px` | narrow text blocks |

Fonts: **Inter** for body, **Raleway** for headings and buttons.

## Known gaps

- **The contact form has no backend.** The original posted to Jetpack's form
  handler. For now the form opens the visitor's mail client with the message
  pre-filled. Wiring it to a real endpoint is the first thing to do.
- **The Google Map** on Kontakti is an `<iframe>` pointing at Google's embed
  URL for Driksas iela 7. The original embedded a saved map; swap in a proper
  Maps Embed API key if you want it stable.
- **Menus are PDFs**, exactly as on the original. The lunch menu changes weekly,
  so this is the obvious candidate for a CMS or a simple upload flow.
- **Category anchors on Konditoreja** — the original only had an `id` on the
  first heading, so nine of the ten dropdown links were broken. All ten work here.
- **Deploying:** this is a client-side SPA, so the host must rewrite unknown
  paths to `index.html` (Netlify `_redirects`, Vercel rewrites, or `try_files`
  in nginx). Without that, a hard refresh on `/konditoreja` 404s.

## Folders you can delete

- `_delete-me/` — a stale `node_modules` from a failed install plus two build
  tarballs used during development. Delete the whole folder, then run
  `npm install`.
- `_source-images-fullsize/` — the original full-size images (202 MB) before
  optimisation. Kept only in case you want to re-export at different sizes;
  nothing references them.
