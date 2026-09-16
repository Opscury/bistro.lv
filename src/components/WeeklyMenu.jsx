import { useEffect, useState } from "react";
import PriceRows from "./PriceRows.jsx";
import { track } from "../lib/analytics.js";
import ui from "../styles/Page.module.css";
import styles from "./WeeklyMenu.module.css";

const WEEKDAY = ["sv.", "p.", "o.", "t.", "c.", "pk.", "s."];

/** "2026-09-01" -> "1.09." */
export function shortDate(iso) {
  if (!iso) return "";
  const [, m, d] = iso.split("-");
  return `${Number(d)}.${m}.`;
}

function dayLabel(iso) {
  const d = new Date(`${iso}T12:00:00`);
  return `${WEEKDAY[d.getDay()]} ${shortDate(iso)}`;
}

function toRows(items) {
  return items.map((it) => ({
    name: it.name,
    size: it.date ? dayLabel(it.date) : it.weight,
    price: `${it.price} €`,
    tag: it.healthy ? "veselīgāk" : undefined,
    tagSoft: true,
  }));
}

/**
 * Bistro nedēļas ēdienkarte kā HTML rindas (menu.json → lunch).
 * PDF paliek kā lejupielāde. Ja derīguma termiņš pagājis vairāk nekā
 * nedēļu, parāda piezīmi — tikai pārlūkā, lai statiskais HTML
 * nemainītos.
 */
export default function WeeklyMenu({ menu }) {
  const [stale, setStale] = useState(false);
  useEffect(() => {
    if (!menu.validTo) return;
    const end = new Date(`${menu.validTo}T23:59:59`);
    setStale(Date.now() - end.getTime() > 7 * 86400000);
  }, [menu.validTo]);

  const validity = menu.validTo
    ? `${shortDate(menu.validFrom)}–${shortDate(menu.validTo)}`
    : `no ${shortDate(menu.validFrom)}`;

  return (
    <section className={ui.section} aria-labelledby="bistro-menu">
      <div className={ui.sectionHead}>
        <h2 className={ui.heading} id="bistro-menu">
          ēdienkarte
        </h2>
        <p className={ui.facts}>
          {menu.time && <span>{menu.time}</span>}
          <span>spēkā {validity}</span>
          <a
            href={menu.pdf}
            target="_blank"
            rel="noreferrer"
            onClick={() => track("pdf", { fails: "pusdienas" })}
          >
            PDF ↗
          </a>
        </p>
      </div>

      {stale && (
        <p className={styles.stale}>
          Šī ir iepriekšējās nedēļas ēdienkarte — šīs nedēļas piedāvājumu jautājiet uz vietas vai skatiet Instagram.
        </p>
      )}

      <div className={styles.columns}>
        {menu.sections.map((sec) => (
          <div key={sec.title} className={styles.block}>
            <h3 className={ui.sub}>
              {sec.title}
              {sec.unit && <em> ({sec.unit})</em>}
            </h3>
            {sec.groups ? (
              sec.groups.map((g) => (
                <div key={g.title} className={styles.group}>
                  <p className={ui.label}>{g.title}</p>
                  <PriceRows rows={toRows(g.items)} ariaLabel={`${sec.title}: ${g.title}`} />
                </div>
              ))
            ) : (
              <PriceRows rows={toRows(sec.items)} ariaLabel={sec.title} />
            )}
          </div>
        ))}
      </div>

      {menu.note && <p className={ui.note}>{menu.note}</p>}
    </section>
  );
}
