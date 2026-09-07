import { useEffect, useMemo, useRef, useState } from "react";
import { formatRange } from "../../data/konditorejaUnits.js";
import { sendOrder } from "../../lib/orderSubmit.js";
import { LEAD_DAYS, minPickupDate } from "../../lib/pickup.js";
import QtyStepper from "./QtyStepper.jsx";
import styles from "../../pages/Konditoreja.module.css";

const EMPTY = { name: "", phone: "", email: "", message: "" };

export default function OrderForm({
  cart,
  orderMode,
  onEnableOrderMode,
  onClose,
  onFinish,
}) {
  const [values, setValues] = useState(EMPTY);
  const [date, setDate] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);
  const rootRef = useRef(null);

  const min = useMemo(minPickupDate, []);

  useEffect(() => {
    rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const update = (field) => (e) =>
    setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await sendOrder({
        customer: values,
        pickup: { date },
        lines: orderMode ? cart.lines : [],
        total: orderMode ? cart.total : { min: 0, max: 0, unknown: false },
        message: values.message,
      });
      setSent(true);
    } catch {
      setError(
        "Pieteikumu neizdevās nosūtīt. Lūdzam zvanīt uz +371 20 20 21 17 vai rakstīt uz banketins@inbox.lv."
      );
    }
  };

  if (sent) {
    return (
      <section className={styles.order} ref={rootRef} aria-live="polite">
        <div className={styles.slip}>
          <div className={styles.sentBox}>
            <h3>ziņa nosūtīta</h3>
            <p>
              Paldies! Kad vēstule būs nosūtīta, mēs sazināsimies pa norādīto
              telefonu vai e-pastu, lai apstiprinātu preču pieejamību, gala cenu
              un saņemšanas datumu.
            </p>
            <p className={styles.sentNote}>
              Ja e-pasta programma neatvērās, rakstiet mums tieši uz{" "}
              <a href="mailto:banketins@inbox.lv">banketins@inbox.lv</a> vai
              zvaniet <a href="tel:+37120202117">+371 20 20 21 17</a>.
            </p>
            <div className={styles.sentActions}>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnGhost}`}
                onClick={() => setSent(false)}
              >
                Atgriezties pie ziņas
              </button>
              <button
                type="button"
                className={styles.btn}
                onClick={() => {
                  cart.clear();
                  setValues(EMPTY);
                  setDate("");
                  setSent(false);
                  onFinish();
                }}
              >
                Pabeigt
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.order} ref={rootRef}>
      <div className={styles.slip}>
        <div className={styles.slipHead}>
          <p className={styles.slipTitle}>
            {orderMode ? "Pasūtījuma lapa" : "Ziņa mums"}
          </p>
          <button
            type="button"
            className={styles.orderClose}
            onClick={onClose}
            aria-label="Aizvērt"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {!orderMode ? (
            <div className={styles.startOrder}>
              <p className={styles.startOrderText}>
                Vēlaties pasūtīt konkrētas preces? Ieslēdziet pasūtījuma
                veidošanu — piedāvājumā parādīsies pogas, ar kurām atzīmēt preces
                un daudzumu.
              </p>
              <button
                type="button"
                className={styles.btn}
                onClick={onEnableOrderMode}
              >
                Izveidot pasūtījumu
              </button>
              <p className={styles.startOrderNote}>
                Vai vienkārši uzrakstiet mums ziņu zemāk.
              </p>
            </div>
          ) : (
            <>
              {cart.lines.length === 0 ? (
                <p className={styles.empty}>
                  Lapa vēl ir tukša. Atgriezieties piedāvājumā un atzīmējiet
                  preces ar <b aria-hidden="true">+</b> pogu.
                </p>
              ) : (
                <>
                  <ul className={styles.cartList}>
                    {cart.lines.map((l) => (
                      <li key={l.key} className={styles.cartLine}>
                        <p className={styles.cartName}>{l.item.name}</p>
                        <div className={styles.cartRight}>
                          <QtyStepper
                            p={l.p}
                            qty={l.qty}
                            name={l.item.name}
                            compact
                            onChange={(v) => cart.setQty(l.key, v)}
                          />
                          <span className={styles.cartSum}>
                            {l.p.priceMin === null
                              ? "—"
                              : formatRange(
                                  l.p.priceMin * l.qty,
                                  l.p.priceMax * l.qty
                                )}
                          </span>
                        </div>
                        <p className={styles.cartMeta}>{l.p.shortPrice}</p>
                      </li>
                    ))}
                  </ul>

                  <div className={styles.totalWrap}>
                    <p className={styles.totalRow}>
                      <span className={styles.totalLabel}>Aptuveni</span>
                      <span className={styles.totalValue}>
                        {formatRange(cart.total.min, cart.total.max)}
                        {cart.total.unknown ? " +" : ""}
                      </span>
                    </p>
                    <p className={styles.totalNote}>
                      Aprēķināts pēc piedāvājuma cenām. Gala cenu un datumu
                      apstiprinām, sazinoties ar Jums.
                    </p>
                  </div>
                </>
              )}

              <span className={styles.orderSub}>Saņemšana</span>
              <label className={styles.field}>
                <span>Vēlamais datums</span>
                <input
                  type="date"
                  min={min}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>
              <p className={styles.hint}>
                Pasūtījumus pieņemam vismaz {LEAD_DAYS} dienas iepriekš.
              </p>
            </>
          )}

          <span className={styles.orderSub}>Kontaktinformācija</span>
          <div className={styles.formRow}>
            <label className={styles.field}>
              <span>
                Vārds <em>(nepieciešams)</em>
              </span>
              <input type="text" required value={values.name} onChange={update("name")} />
            </label>

            <label className={styles.field}>
              <span>
                Telefona Nr. <em>(nepieciešams)</em>
              </span>
              <input type="tel" required value={values.phone} onChange={update("phone")} />
            </label>
          </div>

          <label className={styles.field}>
            <span>
              E-pasts <em>(nepieciešams)</em>
            </span>
            <input type="email" required value={values.email} onChange={update("email")} />
          </label>

          <label className={styles.field}>
            <span>
              {orderMode ? "Piezīmes" : "Ziņojums"}
            </span>
            <textarea rows={5} value={values.message} onChange={update("message")} />
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={`${styles.btn} ${styles.submit}`}>
            Nosūtīt ziņu
          </button>
        </form>
      </div>
    </section>
  );
}
