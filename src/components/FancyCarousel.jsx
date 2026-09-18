import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Img from "./Img.jsx";
import { Lightbox } from "./Gallery.jsx";
import styles from "./FancyCarousel.module.css";

// prerender (SSR) laikā useLayoutEffect nav ko darīt un React par to brīdina
const useIsoLayout = typeof window === "undefined" ? useEffect : useLayoutEffect;

const EASE = 620; // ms — cik ilgi lente slīd līdz nākamajam kadram

/**
 * Tējas namiņa lente. Atšķirībā no pārējām galerijām šī iet no malas
 * līdz malai un griežas pa apli: no pirmā kadra var iet pa kreisi tāpat
 * kā pa labi, jo rindā ir trīs kopijas un pēc katras slīdes lente
 * klusi pārlec atpakaļ uz vidējo. Cilvēks redz bezgalīgu lenti.
 *
 * Kustība ir transformācija, nevis ritināšana: tāpēc to var vilkt ar
 * peli tāpat kā ar pirkstu, un tāpēc to var palaist ar vienu vieglu
 * līkni, kas beidzas lēni. Klikšķis uz vidējā kadra atver lielo skatu.
 */
export default function FancyCarousel({ images, alt = "Galerija" }) {
  const n = images.length;
  const wrapRef = useRef(null);
  const viewRef = useRef(null);
  const [m, setM] = useState({ vw: 0, vpw: 0, sw: 0, gap: 20 }); // mērījumi
  const [pos, setPos] = useState(n); // vieta trīskāršotajā rindā
  const [glide, setGlide] = useState(true); // vai slīdēt (vilkšanas un pārleciena laikā nē)
  const [drag, setDrag] = useState(null); // { id, x0, base, dx, moved }
  const [open, setOpen] = useState(null);

  const reel = n ? [...images, ...images, ...images] : [];
  const index = ((pos % n) + n) % n;

  // izmēri: kadrs ir liels, bet tā, lai kaimiņi paliek redzami
  useIsoLayout(() => {
    const el = wrapRef.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    const measure = () => {
      const cs = getComputedStyle(parent);
      const left = parent.getBoundingClientRect().left + parseFloat(cs.paddingLeft || 0);
      const bleed = Math.max(0, Math.floor(left));
      el.style.setProperty("--bleed", `${bleed}px`);
      const vw = document.documentElement.clientWidth;
      const wide = vw >= 700;
      const sw = Math.round(wide ? Math.min(vw * 0.62, 780) : Math.min(vw * 0.84, 520));
      const gap = wide ? 20 : 12;
      // skats: kadrs + puse no katra kaimiņa. Platā ekrānā (vai kad lapa
      // ir attālināta) pārējie kadri paliek ārpus skata, nevis rindā.
      const vpw = Math.min(vw, sw * 2 + gap * 2);
      el.style.setProperty("--vpw", `${vpw}px`);
      el.style.setProperty("--edge", `${Math.round((vpw - sw) / 2)}px`);
      el.style.setProperty("--arrow-x", `${Math.max(bleed, Math.round((vw - vpw) / 2))}px`);
      setM({ vw, vpw, sw, gap });
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(parent);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // pēc slīdes klusi atgriežas vidējā kopijā, lai vienmēr ir kur iet
  useEffect(() => {
    if (!n) return;
    if (pos >= n && pos < n * 2) return;
    // ārpus trīskāršotās rindas nav ko rādīt — tad jālec tūlīt
    const urgent = pos < 0 || pos >= n * 3;
    const t = setTimeout(
      () => {
        setGlide(false);
        setPos(n + (((pos % n) + n) % n));
      },
      urgent ? 0 : EASE + 260
    );
    return () => clearTimeout(t);
  }, [pos, n]);

  // transformāciju atjauno tikai pēc tam, kad pārleciens uzzīmēts
  useEffect(() => {
    if (glide) return;
    const r = requestAnimationFrame(() => requestAnimationFrame(() => setGlide(true)));
    return () => cancelAnimationFrame(r);
  }, [glide]);

  const go = useCallback((d) => {
    setGlide(true);
    setPos((p) => p + d);
  }, []);

  // klaviatūra
  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    }
  };

  // vilkšana — ar pirkstu un ar peli vienādi
  const step = m.sw + m.gap;
  const onPointerDown = (e) => {
    if (e.button != null && e.button !== 0) return;
    try {
      viewRef.current?.setPointerCapture?.(e.pointerId);
    } catch {
      /* daži pārlūki to neļauj — vilkšana strādā arī bez tā */
    }
    setGlide(false);
    setDrag({ id: e.pointerId, x0: e.clientX, dx: 0, moved: false });
  };
  const onPointerMove = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x0;
    setDrag((d) => (d ? { ...d, dx, moved: d.moved || Math.abs(dx) > 6 } : d));
  };
  const endDrag = (e) => {
    if (!drag || (e && e.pointerId !== drag.id)) return;
    const dx = drag.dx;
    setDrag(null);
    setGlide(true);
    if (step > 0 && Math.abs(dx) > 8) {
      const moved = Math.round(-dx / step);
      setPos((p) => p + (moved === 0 ? (dx < 0 ? 1 : -1) : moved));
    }
  };

  if (!n) return null;

  // lentes nobīde: aktīvais kadrs stāv tieši skata vidū
  const x = m.vpw ? m.vpw / 2 - (pos * step + m.sw / 2) + (drag?.dx || 0) : 0;

  return (
    <>
      <div className={styles.wrap} ref={wrapRef}>
        <div
          className={drag ? `${styles.view} ${styles.viewDrag}` : styles.view}
          ref={viewRef}
          role="group"
          aria-roledescription="galerijas lente"
          aria-label={alt}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <ul
            className={glide ? `${styles.track} ${styles.trackGlide}` : styles.track}
            style={{ transform: `translate3d(${x}px, 0, 0)` }}
          >
            {reel.map((src, i) => {
              const on = i === pos;
              return (
                <li
                  key={`${src}-${i}`}
                  className={on ? `${styles.slide} ${styles.slideOn}` : styles.slide}
                  style={{ width: `${m.sw}px`, marginRight: `${m.gap}px` }}
                  aria-hidden={i < n || i >= n * 2 ? "true" : undefined}
                >
                  <button
                    type="button"
                    className={styles.shot}
                    tabIndex={on ? 0 : -1}
                    onClick={() => {
                      if (drag?.moved) return;
                      if (on) setOpen(index);
                      else go(i - pos);
                    }}
                    aria-label={
                      on
                        ? `${alt}, ${index + 1}. attēls — atvērt lielāku`
                        : `${alt} — pāriet uz šo attēlu`
                    }
                  >
                    <Img
                      name={src}
                      alt=""
                      sizes="(min-width: 700px) 780px, 88vw"
                      loading={i >= n - 1 && i <= n + 2 ? "eager" : "lazy"}
                      draggable="false"
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <button
          type="button"
          className={`${styles.arrow} ${styles.prev}`}
          onClick={() => go(-1)}
          aria-label="Iepriekšējais attēls"
        >
          <span aria-hidden="true">‹</span>
        </button>
        <button
          type="button"
          className={`${styles.arrow} ${styles.next}`}
          onClick={() => go(1)}
          aria-label="Nākamais attēls"
        >
          <span aria-hidden="true">›</span>
        </button>

        <div className={styles.meta}>
          <p className="visually-hidden" aria-live="polite">
            {index + 1} no {n}
          </p>
          <ol className={styles.ticks}>
            {images.map((src, i) => (
              <li key={src}>
                <button
                  type="button"
                  className={i === index ? `${styles.tick} ${styles.tickOn}` : styles.tick}
                  onClick={() => go(i - index)}
                  aria-label={`${i + 1}. attēls`}
                  aria-current={i === index ? "true" : undefined}
                />
              </li>
            ))}
          </ol>
        </div>
      </div>

      {open !== null && (
        <Lightbox
          images={images}
          alt={alt}
          index={open}
          onIndex={setOpen}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
}
