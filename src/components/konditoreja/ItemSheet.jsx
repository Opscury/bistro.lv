import { useEffect, useRef, useState } from "react";
import { DIET_LABELS, formatQty, formatRange } from "../../data/konditorejaUnits.js";
import data from "../../data/konditoreja.json";
import Img from "../Img.jsx";
import QtyStepper from "./QtyStepper.jsx";
import ui from "../../styles/Page.module.css";
import styles from "../../pages/Konditoreja.module.css";

/** Detalizēts preces skats — uz telefona atveras kā apakšējais panelis. */
export default function ItemSheet({ entry, inCart, orderMode, onSetQty, onAdd, onClose }) {
  const { item, p, categoryTitle } = entry;
  const [qty, setQty] = useState(inCart ?? p.minQty);
  const closeRef = useRef(null);

  useEffect(() => setQty(inCart ?? p.minQty), [inCart, p.minQty, item]);

  // Escape aizver, fons nescrollo, fokuss ieiet panelī
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.classList.add("no-scroll");
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("no-scroll");
    };
  }, [onClose]);

  const lineTotal =
    p.priceMin === null ? null : formatRange(p.priceMin * qty, p.priceMax * qty);

  return (
    <div className={styles.backdrop} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.sheet} role="dialog" aria-modal="true" aria-labelledby="item-sheet-title">
        <button type="button" className={styles.sheetClose} onClick={onClose} aria-label="Aizvērt" ref={closeRef}>
          ✕
        </button>

        <div className={styles.sheetScroll}>
          {item.img && (
            <figure className={styles.sheetFigure}>
              <Img className={styles.sheetImg} name={item.img} alt={item.name} sizes="480px" loading="eager" />
            </figure>
          )}

          <div className={styles.sheetBody}>
            <p className={ui.label}>{categoryTitle}</p>
            <h3 id="item-sheet-title" className={styles.sheetTitle}>
              {item.name}
              {item.classic && <span className={ui.tag}>silvas klasika</span>}
            </h3>
            {item.desc && <p className={styles.sheetDesc}>{item.desc}</p>}

            <dl className={styles.facts}>
              <div>
                <dt>Cena</dt>
                <dd>{p.shortPrice}</dd>
              </div>
              {item.weight && (
                <div>
                  <dt>Svars</dt>
                  <dd>{item.weight}</dd>
                </div>
              )}
              <div>
                <dt>Minimālais daudzums</dt>
                <dd>{formatQty(p.minQty, p)}</dd>
              </div>
            </dl>

            {item.allergens?.length ? (
              <>
                <h4 className={styles.sheetSub}>Sastāvs un alergēni</h4>
                <ul className={styles.allergenList}>
                  {item.allergens.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </>
            ) : (
              <p className={styles.placeholder}>
                Par sastāvu un alergēniem jautājiet konditorejā vai pa tālruni {data.orderPhone}.
              </p>
            )}

            {item.diet?.length > 0 && (
              <>
                <h4 className={styles.sheetSub}>Īpašības</h4>
                <ul className={styles.badges}>
                  {item.diet.map((d) => (
                    <li key={d}>{DIET_LABELS[d] || d}</li>
                  ))}
                </ul>
              </>
            )}

            {item.info && <p className={styles.sheetInfo}>{item.info}</p>}
          </div>
        </div>

        {orderMode && (
          <div className={styles.sheetFooter}>
            <QtyStepper p={p} qty={qty} name={item.name} onChange={(v) => setQty(v ?? p.minQty)} />
            {lineTotal && <span className={styles.sheetSum}>≈ {lineTotal}</span>}
            <button
              type="button"
              className={`${ui.btn} ${styles.sheetAdd}`}
              onClick={() => {
                if (inCart) onSetQty(qty);
                else onAdd(qty);
                onClose();
              }}
            >
              {inCart ? "Atjaunot" : "Pievienot"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
