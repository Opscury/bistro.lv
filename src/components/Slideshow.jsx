import { useState, useCallback, useEffect, useRef } from "react";
import Img from "./Img.jsx";
import styles from "./Slideshow.module.css";

/**
 * Slaidrāde: viens attēls, bultiņas un "n / kopā". Lieto tur, kur
 * foto stāv blakus garam tekstam (Telpu noma). DOM-ā ir tikai
 * pašreizējais attēls un tā kaimiņi, tāpēc lapa neielādē visu kopu.
 */
export default function Slideshow({ images, alt = "", ratio = "4 / 3", sizes = "(min-width: 900px) 480px, 100vw" }) {
  const [index, setIndex] = useState(0);
  const total = images.length;
  const ref = useRef(null);
  const startX = useRef(null);

  const go = useCallback(
    (delta) => setIndex((i) => (i + delta + total) % total),
    [total]
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onKey = (e) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [go]);

  if (!total) return null;

  const visible = new Set([index, (index + 1) % total, (index - 1 + total) % total]);

  return (
    <div
      className={styles.slideshow}
      ref={ref}
      tabIndex={0}
      role="group"
      aria-roledescription="slaidrāde"
      aria-label={alt || "Galerija"}
      style={{ "--ratio": ratio }}
      onTouchStart={(e) => (startX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (startX.current === null) return;
        const dx = e.changedTouches[0].clientX - startX.current;
        if (Math.abs(dx) > 48) go(dx < 0 ? 1 : -1);
        startX.current = null;
      }}
    >
      <div className={styles.frame}>
        {images.map((src, i) =>
          visible.has(i) ? (
            <Img
              key={src}
              name={src}
              alt={`${alt} ${i + 1}`}
              sizes={sizes}
              className={i === index ? styles.slideActive : styles.slide}
              loading={i === index ? "eager" : "lazy"}
              aria-hidden={i !== index}
            />
          ) : null
        )}
      </div>

      {total > 1 && (
        <>
          <button
            type="button"
            className={`${styles.arrow} ${styles.prev}`}
            onClick={() => go(-1)}
            aria-label="Iepriekšējais attēls"
          >
            ‹
          </button>
          <button
            type="button"
            className={`${styles.arrow} ${styles.next}`}
            onClick={() => go(1)}
            aria-label="Nākamais attēls"
          >
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
