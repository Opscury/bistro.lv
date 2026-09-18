import { useEffect, useRef, useState } from "react";
import data from "../data/konditoreja.json";
import { itemKey, pricing } from "../data/konditorejaUnits.js";
import { lineById, telHref } from "../data/lines.js";
import useCart from "../hooks/useCart.js";
import Masthead from "../components/Masthead.jsx";
import CategoryBar from "../components/konditoreja/CategoryBar.jsx";
import CartBar from "../components/konditoreja/CartBar.jsx";
import ItemSheet from "../components/konditoreja/ItemSheet.jsx";
import OrderForm from "../components/konditoreja/OrderForm.jsx";
import QtyStepper from "../components/konditoreja/QtyStepper.jsx";
import Img from "../components/Img.jsx";
import { ITEM_SHEET_ENABLED, ORDERING_ENABLED } from "../lib/features.js";
import { track } from "../lib/analytics.js";
import ui from "../styles/Page.module.css";
import styles from "./Konditoreja.module.css";

const categories = data.categories;
const ORDER_PHONE = data.orderPhone;
const ORDER_EMAIL = data.orderEmail;

/**
 * Noslēgums, kamēr pasūtījumu sistēma ir izslēgta: tālrunis un e-pasts.
 * Kad ORDERING_ENABLED = true, tā vietā ir forma.
 */
function PhoneOrderCta() {
  return (
    <div className={ui.cta}>
      <div>
        <h2 className={ui.ctaTitle}>pasūtījumi</h2>
        <p className={ui.ctaText}>
          Kūkas, tortes un citus izstrādājumus pasūtiet pa tālruni vai e-pastu — sazināsimies un
          visu apstiprināsim. Pasūtījumus pieņemam vismaz {data.leadDays} dienas iepriekš.
        </p>
        <p className={ui.facts}>
          <a href={telHref(ORDER_PHONE)}>{ORDER_PHONE}</a>
          <a href={`mailto:${ORDER_EMAIL}`}>{ORDER_EMAIL}</a>
        </p>
      </div>
      <div className={ui.actions}>
        <a
          className={`${ui.btn} ${ui.btnGhost}`}
          href={`mailto:${ORDER_EMAIL}?subject=${encodeURIComponent("Konditorejas pasūtījums")}`}
        >
          Rakstīt e-pastu
        </a>
        <a className={ui.btn} href={telHref(ORDER_PHONE)} onClick={() => track("zvans", { vieta: "konditoreja" })}>
          Zvanīt
        </a>
      </div>
    </div>
  );
}

/** Satura rādītājs ar punktu līnijām. */
function MenuIndex() {
  return (
    <nav className={styles.index} aria-label="Piedāvājuma sadaļas">
      <p className={ui.label} id="piedavajums">
        Piedāvājums
      </p>
      <ol className={styles.indexList}>
        {categories.map((cat) => (
          <li key={cat.id}>
            <a href={`#${cat.id}`}>
              <span>{cat.title}</span>
              <i className={styles.leader} aria-hidden="true" />
              <span className={styles.indexArrow} aria-hidden="true">
                →
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Viena prece. Divos izskatos:
 *   pārlūkošana — kompakta šūna režģī, bez pogām
 *   pasūtīšana  — platāka rinda ar pievienošanas vadīklu
 */
function MenuRow({ entry, qty, orderMode, onOpen, onAdd, onSetQty }) {
  const { item, p } = entry;
  const hasComposition = Boolean(item.allergens?.length);
  // kamēr preces logs ir izslēgts, rinda nav poga — tikai saturs
  const Main = ITEM_SHEET_ENABLED ? "button" : "div";
  const mainProps = ITEM_SHEET_ENABLED
    ? { type: "button", onClick: onOpen }
    : {};

  return (
    <li className={qty ? `${styles.row} ${styles.rowActive}` : styles.row}>
      <Main
        className={ITEM_SHEET_ENABLED ? styles.rowMain : `${styles.rowMain} ${styles.rowStatic}`}
        {...mainProps}
      >
        {item.img ? (
          <span className={styles.thumbBox}>
            <Img className={styles.thumb} name={item.img} alt="" sizes="(min-width: 700px) 300px, 45vw" />
          </span>
        ) : (
          <span className={styles.thumbEmpty} aria-hidden="true" />
        )}

        <span className={styles.rowText}>
          <span className={styles.rowName}>
            {item.name}
            {item.classic && <span className={ui.tag}>silvas klasika</span>}
          </span>
          {item.desc && <span className={styles.rowDesc}>{item.desc}</span>}
          <span className={styles.rowMeta}>
            <span className={styles.rowPrice}>{p.shortPrice}</span>
            {item.weight && <span className={styles.rowWeight}>{item.weight}</span>}
            {ITEM_SHEET_ENABLED && (
              <span className={styles.rowMore}>{hasComposition ? "sastāvs" : "vairāk"}</span>
            )}
          </span>
        </span>

        {ITEM_SHEET_ENABLED && (
          <span className="visually-hidden">Apskatīt informāciju par: {item.name}</span>
        )}
      </Main>

      {orderMode && (
        <div className={styles.rowAction}>
          {qty ? (
            <QtyStepper p={p} qty={qty} name={item.name} compact onChange={onSetQty} />
          ) : (
            <button
              type="button"
              className={styles.addBtn}
              onClick={onAdd}
              aria-label={`Pievienot pasūtījumam: ${item.name}`}
            >
              <span aria-hidden="true">+</span>
            </button>
          )}
        </div>
      )}
    </li>
  );
}

export default function Konditoreja() {
  const line = lineById.konditoreja;
  const cart = useCart();
  const [openEntry, setOpenEntry] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  // Pasūtīšanas režīms sākas izslēgts — lapa vispirms ir piedāvājums.
  // Ja pārlūkā jau ir saglabātas preces, režīms ieslēdzas pats (pēc
  // pirmās izdrukas, lai sakristu ar statisko HTML).
  const [orderMode, setOrderMode] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (ORDERING_ENABLED && cart.ready && cart.lines.length > 0) setOrderMode(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.ready]);

  // Kad režīms ieslēdzas, klients jāaizved atpakaļ pie precēm.
  const enableOrderMode = () => {
    setOrderMode(true);
    setFormOpen(false);
    requestAnimationFrame(() =>
      menuRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    );
  };

  // Režīma izslēgšana groza neiztukšo — preces gaida, ja klients atgriežas.
  const exitOrderMode = () => {
    setOrderMode(false);
    setFormOpen(false);
  };

  const listClass = orderMode ? `${styles.menuList} ${styles.menuListOrder}` : styles.menuList;

  return (
    <div className={ui.page} data-cluster={line.cluster}>
      <div className={ui.shell}>
        <Masthead line={line} rule />
        <MenuIndex />
      </div>

      {/* fiksēta josla zem galvenes; parādās, kad rādītājs aizritināts */}
      <CategoryBar categories={categories} />

      <div className={ui.shell}>
        <div ref={menuRef}>
          {categories.map((cat) => (
            <section key={cat.id} className={ui.section} aria-labelledby={cat.id}>
              <div className={ui.sectionHead}>
                <h2 id={cat.id} className={ui.heading}>
                  {cat.title}
                </h2>
                {cat.note && (
                  <p className={ui.facts}>
                    <span>
                      minimālais pasūtījums{" "}
                      {cat.note
                        .replace(/^Pasūtījuma minimālais daudzums\s*/i, "")
                        .replace(/^Standarta tortes minimālais svars\s*/i, "")}
                    </span>
                  </p>
                )}
              </div>

              <ul className={listClass}>
                {cat.items.map((item) => {
                  const key = itemKey(cat.id, item);
                  const p = pricing(item, cat.id);
                  const entry = { item, p, categoryId: cat.id, categoryTitle: cat.title, key };
                  return (
                    <MenuRow
                      key={key}
                      entry={entry}
                      qty={cart.qtys[key]}
                      orderMode={orderMode}
                      onOpen={() => setOpenEntry(entry)}
                      onAdd={() => cart.add(key)}
                      onSetQty={(v) => cart.setQty(key, v)}
                    />
                  );
                })}
              </ul>
            </section>
          ))}
        </div>

        <p className={ui.note}>
          Informāciju par alergēniem sniedzam konditorejā un pa tālruni {ORDER_PHONE}.
        </p>

        {!ORDERING_ENABLED && <PhoneOrderCta />}

        {ORDERING_ENABLED && (
          <div className={ui.cta}>
            <div>
              <h2 className={ui.ctaTitle}>sazināties vai pasūtīt</h2>
              <p className={ui.ctaText}>
                Uzrakstiet mums ziņu vai izveidojiet pasūtījumu no piedāvājuma. Pasūtījums nav
                pirkums — mēs sazināsimies un visu apstiprināsim.
              </p>
            </div>
            {!formOpen && (
              <button type="button" className={ui.btn} onClick={() => setFormOpen(true)}>
                Sazināties vai pasūtīt
              </button>
            )}
          </div>
        )}

        {ORDERING_ENABLED && formOpen && (
          <OrderForm
            cart={cart}
            orderMode={orderMode}
            onEnableOrderMode={enableOrderMode}
            onClose={() => setFormOpen(false)}
            onFinish={exitOrderMode}
          />
        )}
      </div>

      {ITEM_SHEET_ENABLED && openEntry && (
        <ItemSheet
          entry={openEntry}
          inCart={cart.qtys[openEntry.key]}
          orderMode={orderMode}
          onAdd={(qty) => cart.setQty(openEntry.key, qty)}
          onSetQty={(qty) => cart.setQty(openEntry.key, qty)}
          onClose={() => setOpenEntry(null)}
        />
      )}

      {orderMode && !formOpen && (
        <CartBar cart={cart} onOpen={() => setFormOpen(true)} onExit={exitOrderMode} />
      )}
    </div>
  );
}
