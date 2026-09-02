import { useState, useCallback, useEffect, useRef } from "react";
import styles from "./Slideshow.module.css";

/**
 * Replaces the Jetpack slideshow block from the original site:
 * one image at a time, prev/next arrows and an "n / total" counter.
 */
export default function Slideshow({ images, alt = "", ratio = "16 / 9" }) {
  const [index, setIndex] = useState(0);
  const total = images.length;
  const ref = useRef(null);

  const go = useCallback(
    (delta) => setIndex((i) => (i + delta + total) % total),
    [total]
  );

  // arrow-key support once the slideshow has focus
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

  return (
    <div
      className={styles.slideshow}
      ref={ref}
      tabIndex={0}
      role="group"
      aria-roledescription="slaidrāde"
      aria-label={alt || "Galerija"}
      style={{ "--ratio": ratio }}
    >
      <div className={styles.frame}>
        {images.map((src, i) => (
          <img
            key={src}
            src={`/img/${src}`}
            alt={`${alt} ${i + 1}`}
            className={i === index ? styles.slideActive : styles.slide}
            loading={i === 0 ? "eager" : "lazy"}
            aria-hidden={i !== index}
          />
        ))}
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
