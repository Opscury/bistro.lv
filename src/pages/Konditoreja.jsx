import { useRef, useState } from "react";
import categories from "../data/konditoreja.json";
import { itemKey, pricing } from "../data/konditorejaUnits.js";
import useCart from "../hooks/useCart.js";
import CartBar from "../components/konditoreja/CartBar.jsx";
import ItemSheet from "../components/konditoreja/ItemSheet.jsx";
import OrderForm from "../components/konditoreja/OrderForm.jsx";
import QtyStepper from "../components/konditoreja/QtyStepper.jsx";
import styles from "./Konditoreja.module.css";

/** Satura rādītājs ar punktu līnijām un izstrādājumu skaitu. */
function MenuIndex() {
  return (
    <nav className={styles.index} aria-label="Ēdienkartes sadaļas">
      <p className={styles.label} id="edienkarte">
        Ēdienkarte
      </p>
      <ol className={styles.indexList}>
        {categories.map((cat) => (
          <li key={cat.id}>
            <a href={`#${cat.id}`}>
              <span>{cat.title}</span>
              <i className={styles.leader} aria-hidden="true" />
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

  return (
    <li className={qty ? `${styles.row} ${styles.rowActive}` : styles.row}>
      <button type="button" className={styles.rowMain} onClick={onOpen}>
        {item.img ? (
          <img
            className={styles.thumb}
            src={`/img/${item.img}`}
            alt=""
            loading="lazy"
          />
        ) : (
          <span className={styles.thumbEmpty} aria-hidden="true" />
        )}

        <span className={styles.rowText}>
          <span className={styles.rowName}>{item.name}</span>
          {item.desc && <span className={styles.rowDesc}>{item.desc}</span>}
          <span className={styles.rowMeta}>
            <span className={styles.rowPrice}>{p.shortPrice}</span>
            {item.weight && (
              <span className={styles.rowWeight}>{item.weight}</span>
            )}
            <span className={styles.rowMore}>sastāvs</span>
          </span>
        </span>

        <span className="visually-hidden">
          Apskatīt informāciju par: {item.name}
        </span>
      </button>

      {orderMode && (
        <div className={styles.rowAction}>
          {qty ? (
            <QtyStepper
              p={p}
              qty={qty}
              name={item.name}
              compact
              onChange={onSetQty}
            />
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
  const cart = useCart();
  const [openEntry, setOpenEntry] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  // Pasūtīšanas režīms sākas izslēgts — lapa vispirms ir ēdienkarte.
  // Ja pārlūkā jau ir saglabātas preces, režīms atgriežas pats.
  const [orderMode, setOrderMode] = useState(() => cart.lines.length > 0);
  const menuRef = useRef(null);

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

  const listClass = orderMode
    ? `${styles.menuList} ${styles.menuListOrder}`
    : styles.menuList;

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.mast}>
          <h1 className={styles.title}>konditoreja</h1>
        </header>

        <MenuIndex />

        <div ref={menuRef}>
          {categories.map((cat) => (
            <section key={cat.id} className={styles.section}>
              <div className={styles.sectionHead}>
                <h2 id={cat.id} className={styles.heading}>
                  {cat.title}
                </h2>
              </div>

              {cat.note && (
                <p className={styles.note}>
                  <span>Minimālais pasūtījums</span>
                  <span className={styles.noteValue}>
                    {cat.note.replace(/^Pasūtījuma minimālais daudzums\s*/i, "")
                      .replace(/^Standarta tortes minimālais svars\s*/i, "")}
                  </span>
                </p>
              )}

              <ul className={listClass}>
                {cat.items.map((item) => {
                  const key = itemKey(cat.id, item);
                  const p = pricing(item, cat.id);
                  const entry = {
                    item,
                    p,
                    categoryId: cat.id,
                    categoryTitle: cat.title,
                    key,
                  };
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

              <a className={styles.backToIndex} href="#edienkarte">
                ↑ ēdienkarte
              </a>
            </section>
          ))}
        </div>

        <div className={styles.ctaBlock}>
          <div>
            <h2 className={styles.ctaTitle}>sazināties vai pasūtīt</h2>
            <p className={styles.ctaText}>
              Uzrakstiet mums ziņu vai izveidojiet pasūtījumu no ēdienkartes.
              Pasūtījums nav pirkums — mēs sazināsimies un visu apstiprināsim.
            </p>
          </div>
          {!formOpen && (
            <button
              type="button"
              className={styles.btn}
              onClick={() => setFormOpen(true)}
            >
              Sazināties vai pasūtīt
            </button>
          )}
        </div>

        {formOpen && (
          <OrderForm
            cart={cart}
            orderMode={orderMode}
            onEnableOrderMode={enableOrderMode}
            onClose={() => setFormOpen(false)}
            onFinish={exitOrderMode}
          />
        )}
      </div>

      {openEntry && (
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
        <CartBar
          cart={cart}
          onOpen={() => setFormOpen(true)}
          onExit={exitOrderMode}
        />
      )}
    </div>
  );
}
