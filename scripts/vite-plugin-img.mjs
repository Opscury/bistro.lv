/* ---------------------------------------------------------------
   Attēlu izmēri būvējot.

   public/img/ satur oriģinālus (līdz 1400 px). Šis spraudnis:
   - nolasa katra attēla izmērus un iedod tos kodam kā __IMG_MANIFEST__,
     lai <Img> var uzrakstīt srcset un width/height (bez lēkāšanas);
   - `vite build` laikā uzģenerē mazākas kopijas dist/img/vārds-320.webp,
     vārds-640.webp (tikai ja oriģināls ir lielāks); kešo
     node_modules/.cache/silva-img/, tāpēc atkārtota būve ir ātra;
   - `vite dev` laikā tās pašas kopijas taisa pēc pieprasījuma.

   Jaunam attēlam nekas nav jādara — nomet public/img/ un būvē.
   --------------------------------------------------------------- */

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const EXT = /\.(webp|jpe?g|png)$/i;
const VARIANT = /-(\d{3,4})\.webp$/;

export default function imgVariants({
  dir = "public/img",
  widths = [320, 640],
  quality = 78,
  cacheDir = "node_modules/.cache/silva-img",
} = {}) {
  let root = process.cwd();
  let manifest = {};
  let isSsr = false;
  let outDir = "dist";

  async function scan() {
    const abs = path.resolve(root, dir);
    if (!fs.existsSync(abs)) return {};
    const out = {};
    for (const f of fs.readdirSync(abs)) {
      if (!EXT.test(f) || VARIANT.test(f)) continue;
      try {
        const m = await sharp(path.join(abs, f)).metadata();
        out[f] = {
          w: m.width,
          h: m.height,
          widths: widths.filter((w) => w < m.width),
        };
      } catch {
        /* nav attēls — izlaiž */
      }
    }
    return out;
  }

  async function variant(srcFile, width, dest) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    await sharp(srcFile)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toFile(dest);
  }

  return {
    name: "silva-img-variants",

    async config(cfg, env) {
      root = cfg.root ? path.resolve(cfg.root) : process.cwd();
      isSsr = Boolean(cfg.build?.ssr);
      outDir = cfg.build?.outDir || "dist";
      manifest = await scan();
      return {
        define: { __IMG_MANIFEST__: JSON.stringify(manifest) },
      };
    },

    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const m = (req.url || "").match(/^\/img\/(.+)-(\d{3,4})\.webp(?:\?.*)?$/);
        if (!m) return next();
        const [, base, w] = m;
        const entry = Object.keys(manifest).find((k) => k.replace(/\.\w+$/, "") === base);
        if (!entry || !manifest[entry].widths.includes(Number(w))) return next();
        const src = path.resolve(root, dir, entry);
        try {
          const buf = await sharp(src)
            .resize({ width: Number(w), withoutEnlargement: true })
            .webp({ quality })
            .toBuffer();
          res.setHeader("Content-Type", "image/webp");
          res.setHeader("Cache-Control", "no-cache");
          res.end(buf);
        } catch {
          next();
        }
      });
    },

    async closeBundle() {
      if (isSsr) return;
      const cache = path.resolve(root, cacheDir);
      const out = path.resolve(root, outDir, "img");
      let made = 0;
      let copied = 0;
      for (const [file, m] of Object.entries(manifest)) {
        const src = path.resolve(root, dir, file);
        const base = file.replace(/\.\w+$/, "");
        const srcMtime = fs.statSync(src).mtimeMs;
        for (const w of m.widths) {
          const name = `${base}-${w}.webp`;
          const cached = path.join(cache, name);
          const dest = path.join(out, name);
          const fresh =
            fs.existsSync(cached) && fs.statSync(cached).mtimeMs >= srcMtime;
          if (!fresh) {
            await variant(src, w, cached);
            made++;
          } else {
            copied++;
          }
          fs.mkdirSync(path.dirname(dest), { recursive: true });
          fs.copyFileSync(cached, dest);
        }
      }
      console.log(
        `[img] ${Object.keys(manifest).length} attēli, ${made} jaunas kopijas, ${copied} no keša`
      );
    },
  };
}
