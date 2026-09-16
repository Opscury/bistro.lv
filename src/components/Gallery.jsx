import { useCallback, useEffect, useRef, useState } from "react";
import Img from "./Img.jsx";
import styles from "./Gallery.module.css";

/**
 * Galerija: režģis ar dažiem izraudzītiem foto (`featured` skaits) un
 * lielais skats (lightbox) visai kopai. Aizstāj slaidrādes ar "1 / 37":
 * pārlūks ielādē tikai režģa sīktēlus, pārējo — kad atver.
 *
 * images: ["fails.webp", …]; featured: cik rādīt režģī (6);
 * columns: 2 | 3 | 4; alt: kopas nosaukums.
 */
export default function Gallery({ images, alt = "Galerija", featured = 6, columns = 3 }) {
  const [open, setOpen] = useState(null); // indekss vai null
  const shown = images.slice(0, featured);
  const rest = images.length - shown.length;

  return (
    <>
      <ul
        className={styles.grid}
        style={{ "--cols": columns }}
        aria-label={alt}
      >
        {shown.map((src, i) => (
          <li key={src}>
            <button
              type="button"
              className={styles.thumb}
              onClick={() => setOpen(i)}
              aria-label={`${alt}, ${i + 1}. attēls — atvērt lielāku`}
            >
              <Img name={src} alt="" sizes="(min-width: 700px) 320px, 50vw" />
              {i === shown.length - 1 && rest > 0 && (
                <span className={styles.more} aria-hidden="true">
                  +{rest}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
      {open !== null && (
        <Lightbox images={images} alt={alt} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
      )}
    </>
  );
}

function Lightbox({ images, alt, index, onIndex, onClose }) {
  const total = images.length;
  const closeRef = useRef(null);
  const startX = useRef(null);

  const go = useCallback(
    (delta) => onIndex((index + delta + total) % total),
    [index, total, onIndex]
  );

  useEffect(() => {
    document.body.classList.add("no-scroll");
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("no-scroll");
      document.removeEventListener("keydown", onKey);
    };
  }, [go, onClose]);

  // iepriekš ielādē kaimiņus
  useEffect(() => {
    [index - 1, index + 1].forEach((i) => {
      const src = images[(i + total) % total];
      const im = new Image();
      im.src = `/img/${src}`;
    });
  }, [index, images, total]);

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label={`${alt}, ${index + 1} no ${total}`}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      onTouchStart={(e) => (startX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (startX.current === null) return;
        const dx = e.changedTouches[0].clientX - startX.current;
        if (Math.abs(dx) > 48) go(dx < 0 ? 1 : -1);
        startX.current = null;
      }}
    >
      <button type="button" className={styles.close} onClick={onClose} aria-label="Aizvērt" ref={closeRef}>
        ✕
      </button>
      <Img
        key={images[index]}
        name={images[index]}
        alt={`${alt} ${index + 1}`}
        sizes="100vw"
        loading="eager"
        className={styles.big}
      />
      {total > 1 && (
        <>
          <button type="button" className={`${styles.arrow} ${styles.prev}`} onClick={() => go(-1)} aria-label="Iepriekšējais attēls">
            ‹
          </button>
          <button type="button" className={`${styles.arrow} ${styles.next}`} onClick={() => go(1)} aria-label="Nākamais attēls">
            ›
          </button>
          <p className={styles.counter} aria-live="polite">
            {index + 1} / {total}
          </p>
        </>
      )}
    </div>
  );
}
