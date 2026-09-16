/* global __IMG_MANIFEST__ */

// Attēls no public/img ar srcset, width un height. Izmēru sarakstu
// būvējot ieliek scripts/vite-plugin-img.mjs; `sizes` saka pārlūkam,
// cik plats attēls būs ekrānā, lai tas ņem mazāko pietiekamo kopiju.
const MANIFEST = typeof __IMG_MANIFEST__ !== "undefined" ? __IMG_MANIFEST__ : {};

/** "/img/x.webp" (kā to raksta CMS) -> "x.webp" */
export const imgName = (n) => (n || "").replace(/^\/?img\//, "");

export function imgMeta(name) {
  return MANIFEST[imgName(name)] || null;
}

export default function Img({ name: rawName, alt = "", sizes = "100vw", loading = "lazy", ...rest }) {
  const name = imgName(rawName);
  const m = MANIFEST[name];
  const src = `/img/${name}`;
  if (!m || !m.widths.length) {
    return <img src={src} alt={alt} loading={loading} width={m?.w} height={m?.h} {...rest} />;
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
      alt={alt}
      loading={loading}
      {...rest}
    />
  );
}
