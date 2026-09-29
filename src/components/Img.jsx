/* global __IMG_MANIFEST__ */

// Attēls ar srcset, width un height. Divi avoti:
//   name  — fails no public/img; izmērus būvējot ieliek scripts/vite-plugin-img.mjs
//   image — bilde no admin API: { src, srcset, w, h, alt, name }. Kamēr tā ir
//           tā pati, kas public/img (image.name), to rāda no vietnes pašas —
//           tāpat kā līdz šim; nomainītu bildi — no /media (Django).
// `sizes` saka pārlūkam, cik plats attēls būs ekrānā, lai tas ņem mazāko
// pietiekamo kopiju.
const MANIFEST = typeof __IMG_MANIFEST__ !== "undefined" ? __IMG_MANIFEST__ : {};

/** "/img/x.webp" (kā to raksta CMS) -> "x.webp" */
export const imgName = (n) => (n || "").replace(/^\/?img\//, "");

export function imgMeta(name) {
  return MANIFEST[imgName(name)] || null;
}

/** Bildes URL (priekšielādei, JSON-LD): public/img vai /media. */
export function imgSrc(image) {
  if (!image) return "";
  if (typeof image === "string") return `/img/${imgName(image)}`;
  const local = imgName(image.name);
  if (local && MANIFEST[local]) return `/img/${local}`;
  return image.src || "";
}

/** Stabila atslēga sarakstiem: faila nosaukums vai URL. */
export const imgKey = (image) => (typeof image === "string" ? image : image?.name || image?.src || "");

export default function Img({ name: rawName, image, alt, sizes = "100vw", loading = "lazy", ...rest }) {
  if (typeof image === "string") {
    rawName = image;
    image = null;
  }
  const altText = alt ?? image?.alt ?? "";
  const name = imgName(image?.name || rawName);
  const m = name ? MANIFEST[name] : null;

  // bilde no API, kas nav vietnes public/img (nomainīta adminā)
  if (image && !m && image.src) {
    return (
      <img
        src={image.src}
        srcSet={image.srcset || undefined}
        sizes={image.srcset ? sizes : undefined}
        width={image.w || undefined}
        height={image.h || undefined}
        alt={altText}
        loading={loading}
        {...rest}
      />
    );
  }

  const src = `/img/${name}`;
  if (!m || !m.widths.length) {
    return <img src={src} alt={altText} loading={loading} width={m?.w} height={m?.h} {...rest} />;
  }
  const base = name.replace(/\.\w+$/, "");
  const srcSet = [
    ...m.widths.map((w) => `/img/${base}-${w}.webp ${w}w`),
    `${src} ${m.w}w`,
  ].join(", ");
  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      width={m.w}
      height={m.h}
      alt={altText}
      loading={loading}
      {...rest}
    />
  );
}
