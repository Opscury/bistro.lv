import { useEffect, useMemo, useRef, useState } from "react";
import { formatRange } from "../../data/konditorejaUnits.js";
import { sendOrder, ORDER_EMAIL, ORDER_PHONE } from "../../lib/orderSubmit.js";
import { LEAD_DAYS, minPickupDate } from "../../lib/pickup.js";
import { telHref } from "../../data/lines.js";
import { track } from "../../lib/analytics.js";
import QtyStepper from "./QtyStepper.jsx";
import ui from "../../styles/Page.module.css";
import styles from "../../pages/Konditoreja.module.css";

const EMPTY = { name: "", phone: "", email: "", message: "" };

export default function OrderForm({ cart, orderMode, onEnableOrderMode, onClose, onFinish }) {
  const [values, setValues] = useState(EMPTY);
  const [date, setDate] = useState("");
  const [sent, setSent] = useState(null); // null | "api" | "netlify" | "mailto"
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const rootRef = useRef(null);

  const min = useMemo(minPickupDate, []);

  useEffect(() => {
    rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const update = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await sendOrder({
        customer: values,
        pickup: { date },
        lines: orderMode ? cart.lines : [],
        total: orderMode ? cart.total : { min: 0, max: 0, unknown: false },
        message: values.message,
      });
      track("forma", { veids: orderMode ? "pasutijums" : "zina" });
      setSent(res.method);
    } catch {
      setError(
        `Pieteikumu neizdevās nosūtīt. Lūdzam zvanīt ${ORDER_PHONE} vai rakstīt uz ${ORDER_EMAIL}.`
      );
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <section className={styles.order} ref={rootRef} aria-live="polite">
        <div className={ui.slip}>
          <div className={styles.sentBox}>
            <h3>{sent === "mailto" ? "vēstule sagatavota" : "pieteikums saņemts"}</h3>
            <p>
              {sent === "mailto"
                ? "Jūsu e-pasta programmā atvērās vēstule ar pieteikumu — nosūtiet to. Kad tā pienāks, sazināsimies pa norādīto tālruni vai e-pastu, lai apstiprinātu pieejamību, gala cenu un saņemšanas datumu."
                : "Paldies! Sazināsimies pa norādīto tālruni vai e-pastu, lai apstiprinātu preču pieejamību, gala cenu un saņemšanas datumu."}
            </p>
            <p className={styles.sentNote}>
              Ja steidzas, rakstiet uz{" "}
              <a href={`mailto:${ORDER_EMAIL}`}>{ORDER_EMAIL}</a> vai zvaniet{" "}
              <a href={telHref(ORDER_PHONE)}>{ORDER_PHONE}</a>.
            </p>
            <div className={styles.sentActions}>
              <button type="button" className={`${ui.btn} ${ui.btnGhost}`} onClick={() => setSent(null)}>
                Atgriezties pie ziņas
              </button>
              <button
                type="button"
                className={ui.btn}
                onClick={() => {
                  cart.clear();
                  setValues(EMPTY);
                  setDate("");
                  setSent(null);
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
      <div className={ui.slip}>
        <div className={ui.slipHead}>
          <p className={ui.label}>{orderMode ? "Pasūtījuma lapa" : "Ziņa mums"}</p>
          <button type="button" className={styles.orderClose} onClick={onClose} aria-label="Aizvērt">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} name="pasutijums">
          {!orderMode ? (
            <div className={styles.startOrder}>
              <p className={styles.startOrderText}>
                Vēlaties pasūtīt konkrētas preces? Ieslēdziet pasūtījuma veidošanu — piedāvājumā
                parādīsies pogas, ar kurām atzīmēt preces un daudzumu.
              </p>
              <button type="button" className={ui.btn} onClick={onEnableOrderMode}>
                Izveidot pasūtījumu
              </button>
              <p className={styles.startOrderNote}>Vai vienkārši uzrakstiet mums ziņu zemāk.</p>
            </div>
          ) : (
            <>
              {cart.lines.length === 0 ? (
                <p className={styles.empty}>
                  Lapa vēl ir tukša. Atgriezieties piedāvājumā un atzīmējiet preces ar{" "}
                  <b aria-hidden="true">+</b> pogu.
                </p>
              ) : (
                <>
                  <ul className={styles.cartList}>
                    {cart.lines.map((l) => (
                      <li key={l.key} className={styles.cartLine}>
                        <p className={styles.cartName}>{l.item.name}</p>
                        <div className={styles.cartRight}>
                          <QtyStepper p={l.p} qty={l.qty} name={l.item.name} compact onChange={(v) => cart.setQty(l.key, v)} />
                          <span className={styles.cartSum}>
                            {l.p.priceMin === null
                              ? "—"
                              : formatRange(l.p.priceMin * l.qty, l.p.priceMax * l.qty)}
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
                      Aprēķināts pēc piedāvājuma cenām. Gala cenu un datumu apstiprinām, sazinoties ar Jums.
                    </p>
                  </div>
                </>
              )}

              <span className={styles.orderSub}>Saņemšana</span>
              <label className={ui.field}>
                <span>Vēlamais datums</span>
                <input id="order-date" name="date" type="date" min={min} value={date} onChange={(e) => setDate(e.target.value)} />
              </label>
              <p className={ui.hint}>Pasūtījumus pieņemam vismaz {LEAD_DAYS} dienas iepriekš.</p>
            </>
          )}

          <span className={styles.orderSub}>Kontaktinformācija</span>
          <div className={ui.formRow}>
            <label className={ui.field}>
              <span>
                Vārds <em>(nepieciešams)</em>
              </span>
              <input id="order-name" name="name" type="text" required autoComplete="name" value={values.name} onChange={update("name")} />
            </label>

            <label className={ui.field}>
              <span>
                Telefona Nr. <em>(nepieciešams)</em>
              </span>
              <input id="order-phone" name="phone" type="tel" required autoComplete="tel" value={values.phone} onChange={update("phone")} />
            </label>
          </div>

          <label className={ui.field}>
            <span>
              E-pasts <em>(nepieciešams)</em>
            </span>
            <input id="order-email" name="email" type="email" required autoComplete="email" value={values.email} onChange={update("email")} />
          </label>

          <label className={ui.field}>
            <span>{orderMode ? "Piezīmes" : "Ziņojums"}</span>
            <textarea id="order-message" name="message" rows={5} value={values.message} onChange={update("message")} />
          </label>

          {error && <p className={ui.error}>{error}</p>}

          <button type="submit" className={`${ui.btn} ${ui.submit}`} disabled={busy}>
            {busy ? "Sūta…" : orderMode ? "Nosūtīt pieteikumu" : "Nosūtīt ziņu"}
          </button>
        </form>
      </div>
    </section>
  );
}
