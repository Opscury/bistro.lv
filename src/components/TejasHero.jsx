import { useState } from "react";
import Img from "./Img.jsx";
import { Lightbox } from "./Gallery.jsx";
import styles from "./TejasHero.module.css";

/**
 * Tējas namiņa galva — namiņš vakarā.
 *
 * Fotogrāfijas, pēc kurām šī lapa taisīta, ir vakara bildes: tumšs
 * debess, silti logi, lampiņu virtenes. Tāpēc arī galva ir vakars.
 * Namiņš stāv kā laterna uz Pasta salas: stikls deg no iekšpuses,
 * rāmji ir silueti gaismas priekšā, un vidējā logā deg tas, kas
 * namiņā šobrīd aktuāls. Tā ir vienīgā tumšā virsma visā vietnē un
 * vienīgā vieta, kur plakāts spīd — tāpēc uz to skatās.
 *
 * Teksts nesēž uz stikla: uz stikla ir viena lieta, un tā ir plakāts.
 *
 * Viss dzīvo viewBox 0 0 1400 720 koordinātās. Dzegas augstumu dod
 * EAVE(x); vītnes un ribas rēķinās pēc tās, tāpēc proporcijas var
 * mainīt vienā vietā.
 */

/* --- namiņa ģeometrija --- */
const CX = 700;
const HALF = 540;
const EAVE_MID = 210;
const EAVE_END = 246;
const EAVE_CTRL = 2 * EAVE_MID - EAVE_END;
const LANTERN = 86;

/** Jumta apakšmalas augstums dotajā x — namiņš ir apaļš, malas nokrīt. */
const EAVE = (x) => EAVE_MID + (EAVE_END - EAVE_MID) * ((x - CX) / HALF) ** 2;

const POSTS = [180, 300, 520, 880, 1100, 1220];

/* pieci logi; vidējais ir plats, jo tur karājas plakāts */
const WINDOWS = [
  { id: "a", x: 190, y: 310, w: 100, h: 410, lag: 0.5, dim: true },
  { id: "b", x: 310, y: 300, w: 200, h: 420, lag: 0.28 },
  { id: "c", x: 530, y: 290, w: 340, h: 430, lag: 0 },
  { id: "d", x: 890, y: 300, w: 200, h: 420, lag: 0.28 },
  { id: "e", x: 1110, y: 310, w: 100, h: 410, lag: 0.5, dim: true },
];

/* vieta uz jumta, ko aizņem virsraksts — ribas tur netiek zīmētas */
const TITLE_BOX = { x: 380, y: 84, w: 640, h: 128 };

/** Viena lampiņu vītne: līkne starp diviem punktiem + bumbiņu vietas. */
function swag(x1, x2, drop, count) {
  const y1 = EAVE(x1) + 60;
  const y2 = EAVE(x2) + 60;
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2 + drop * 2;
  const pts = [];
  for (let i = 1; i < count; i += 1) {
    const t = i / count;
    const u = 1 - t;
    pts.push([
      u * u * x1 + 2 * u * t * cx + t * t * x2,
      u * u * y1 + 2 * u * t * cy + t * t * y2,
    ]);
  }
  return {
    d: `M${x1.toFixed(1)} ${y1.toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`,
    pts,
    low: [cx, (y1 + y2) / 2 + drop],
  };
}

const SWAGS = POSTS.slice(0, -1).map((x, i) => {
  const span = POSTS[i + 1] - x;
  return swag(x, POSTS[i + 1], span > 200 ? 26 : 18, Math.max(4, Math.round(span / 34)));
});

/* lāstekas — ne vidējā logā, kur karājas plakāts */
const ICICLES = SWAGS.filter((s) => Math.abs(s.low[0] - CX) > 60).map((s, i) => {
  const [x, y] = s.low;
  const len = 40 + (i % 3) * 20;
  return { x, y, len, dots: [y + len * 0.36, y + len * 0.7, y + len] };
});

/* Ribas nāk no smailes, bet sākas tikai aiz virsraksta vietas. */
const RIBS = [-1, -0.84, -0.66, 0.66, 0.84, 1]
  .map((t) => {
    const x1 = CX;
    const y1 = LANTERN + 26;
    const x2 = CX + t * HALF;
    const y2 = EAVE(x2) - 3;
    const edgeX = t > 0 ? TITLE_BOX.x + TITLE_BOX.w + 6 : TITLE_BOX.x - 6;
    const ux = Math.abs(x2 - x1) > 1 ? (edgeX - x1) / (x2 - x1) : Infinity;
    const uy = Math.abs(y2 - y1) > 1 ? (TITLE_BOX.y + TITLE_BOX.h + 6 - y1) / (y2 - y1) : Infinity;
    const u = Math.min(Math.max(Math.min(ux, uy), 0), 0.94);
    return `M${(x1 + (x2 - x1) * u).toFixed(0)} ${(y1 + (y2 - y1) * u).toFixed(0)} ${x2.toFixed(0)} ${y2.toFixed(0)}`;
  })
  .join("");

/* rotātā dzegas mala — tā, kas ķer lampiņu gaismu */
const SCALLOP = (() => {
  const step = 30;
  let d = `M168 ${EAVE(168).toFixed(1)}`;
  for (let x = 168; x < 1232; x += step) {
    const dy = EAVE(x + step) - EAVE(x);
    d += `q${step / 2} ${(10 + dy / 2).toFixed(1)} ${step} ${dy.toFixed(1)}`;
  }
  return d;
})();

export default function TejasHero({ title, intro, notice }) {
  const [open, setOpen] = useState(false);
  let n = 0;

  return (
    <div className={styles.hero}>
      <div className={styles.stageWrap}>
        <div className={styles.stage}>
          <svg
            className={styles.draw}
            viewBox="0 0 1400 720"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              {/* stikls deg no iekšpuses: siltāks lejā, kur ir lampas */}
              <linearGradient id="tn-lit" x1="0" y1="0" x2="0.2" y2="1">
                <stop offset="0%" stopColor="#fbeccb" />
                <stop offset="45%" stopColor="#f2d59a" />
                <stop offset="100%" stopColor="#dcae6a" />
              </linearGradient>
              <linearGradient id="tn-lit-soft" x1="0" y1="0" x2="0.2" y2="1">
                <stop offset="0%" stopColor="#e7d5ae" />
                <stop offset="45%" stopColor="#d8bb84" />
                <stop offset="100%" stopColor="#bb9155" />
              </linearGradient>
              {/* gaisma, kas izplūst naktī ap namiņu */}
              <radialGradient id="tn-spill" cx="0.5" cy="0.54" r="0.5">
                <stop offset="0%" stopColor="#ffc87a" stopOpacity="0.42" />
                <stop offset="52%" stopColor="#ffb85e" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#ffb85e" stopOpacity="0" />
              </radialGradient>
              {WINDOWS.map((w) => (
                <rect key={w.id} id={`tn-w-${w.id}`} x={w.x} y={w.y} width={w.w} height={w.h} rx="4" />
              ))}
            </defs>

            {/* ---- gaismas mākonis aiz namiņa ---- */}
            <ellipse cx="700" cy="430" rx="620" ry="330" fill="url(#tn-spill)" />

            {/* ---- degošie logi ---- */}
            {WINDOWS.map((w) => (
              <use
                key={w.id}
                href={`#tn-w-${w.id}`}
                className={w.dim ? `${styles.lit} ${styles.litDim}` : styles.lit}
                fill={w.id === "c" ? "url(#tn-lit)" : "url(#tn-lit-soft)"}
                style={{ animationDelay: `${w.lag}s` }}
              />
            ))}

            {/* ---- rāmji un rūtis: silueti gaismas priekšā ---- */}
            <g className={styles.mullion}>
              <path d="M240 310v410M190 400h100M190 560h100M190 668h100" />
              <path d="M310 368h200M310 646h200M410 300v420" />
              <path d="M643 290v430M757 290v430M530 378h340M530 466h340M530 554h340M530 642h340" />
              <path d="M890 368h200M890 646h200M990 300v420" />
              <path d="M1160 310v410M1110 400h100M1110 560h100M1110 668h100" />
            </g>
            {WINDOWS.map((w) => (
              <use key={w.id} href={`#tn-w-${w.id}`} className={styles.frame} />
            ))}

            {/* ---- stabi ---- */}
            <g className={styles.post}>
              <rect x="170" y="302" width="20" height="418" rx="3" />
              <rect x="290" y="292" width="20" height="428" rx="3" />
              <rect x="510" y="282" width="20" height="438" rx="3" />
              <rect x="870" y="282" width="20" height="438" rx="3" />
              <rect x="1090" y="292" width="20" height="428" rx="3" />
              <rect x="1210" y="302" width="20" height="418" rx="3" />
            </g>

            {/* ---- fasādes josla ---- */}
            <path className={styles.band} d="M208 270Q700 210 1192 270v32Q700 242 208 302z" />

            {/* ---- jumts ---- */}
            <path
              className={styles.line}
              d={`M160 ${EAVE_END}C252 178 448 94 ${CX} ${LANTERN}c252 8 448 92 540 ${(EAVE_END - LANTERN).toFixed(0)}`}
            />
            <path className={styles.line} d={`M160 ${EAVE_END}Q${CX} ${EAVE_CTRL} 1240 ${EAVE_END}`} />
            <path className={styles.thin} d={RIBS} />
            <path className={styles.thin} d={SCALLOP} />

            {/* ---- lanterna ---- */}
            <path className={styles.line} d="M634 86V44h132v42" />
            <path className={styles.thin} d="M664 80V50M700 80V50M736 80V50" />
            <path className={styles.line} d="M606 44c12-20 44-34 94-34s82 14 94 34z" />
            <path className={styles.line} d="M596 44h208" />
            <path className={styles.line} d="M616 86h168" />

            {/* ---- lampiņas ---- */}
            <g className={styles.wire}>
              {SWAGS.map((s) => (
                <path key={s.d} d={s.d} />
              ))}
              {ICICLES.map((ic) => (
                <path key={`w${ic.x}`} d={`M${ic.x.toFixed(1)} ${ic.y.toFixed(1)}v${ic.len}`} />
              ))}
            </g>
            <g className={styles.bulbs}>
              {SWAGS.flatMap((s) =>
                s.pts.map(([x, y]) => {
                  n += 1;
                  return (
                    <circle
                      key={`b${x.toFixed(1)}`}
                      cx={x.toFixed(1)}
                      cy={y.toFixed(1)}
                      r="5.8"
                      style={{ animationDelay: `${((n * 0.37) % 2.6).toFixed(2)}s` }}
                    />
                  );
                })
              )}
              {ICICLES.flatMap((ic) =>
                ic.dots.map((y) => {
                  n += 1;
                  return (
                    <circle
                      key={`i${ic.x.toFixed(1)}-${y.toFixed(1)}`}
                      cx={ic.x.toFixed(1)}
                      cy={y.toFixed(1)}
                      r="4.8"
                      style={{ animationDelay: `${((n * 0.53) % 2.6).toFixed(2)}s` }}
                    />
                  );
                })
              )}
            </g>
          </svg>

          <h1 className={styles.title}>{title}</h1>

          {/* ---- plakāts vidējā logā (530..870): vienādas malas 25 ---- */}
          <button
            type="button"
            className={styles.slot}
            onClick={() => setOpen(true)}
            aria-label={`${notice.label}: ${notice.alt} — atvērt lielāku`}
          >
            <Img
              className={styles.poster}
              name={notice.photo}
              alt={notice.alt}
              sizes="(min-width: 900px) 340px, 52vw"
            />
            {/* loga gaisma, kas krīt uz plakāta: ēna no rāmja augšā,
                siltums no lampām lejā. Pazūd, kad uz to liek peli. */}
            <span className={styles.glaze} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className={styles.below}>
        <p className={styles.intro}>{intro[0]}</p>
        <p className={styles.intro}>{intro[1]}</p>
      </div>

      {open && (
        <Lightbox
          images={[notice.photo]}
          alt={notice.label}
          index={0}
          onIndex={() => {}}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
