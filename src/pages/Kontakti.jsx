import { useState } from "react";
import { Link } from "react-router-dom";
import {
  company, lines, hoursRows, fullAddress, mapLinks, telHref, phoneList, emailList,
} from "../data/lines.js";
import { sendForm, fieldsToText, SEND_METHOD } from "../lib/sendForm.js";
import { track } from "../lib/analytics.js";
import { ENQUIRY_FORM_ENABLED } from "../lib/features.js";
import ui from "../styles/Page.module.css";
import styles from "./Kontakti.module.css";

function ContactForm() {
  const [sent, setSent] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [values, setValues] = useState({ name: "", phone: "", email: "", message: "" });
  const to = lines.find((l) => l.id === "banketi").email;

  const update = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await sendForm("kontakti", values, {
        to,
        subject: "Ziņa no bistro.lv",
        body: fieldsToText([
          ["Ziņa", values.message],
          ["Vārds", values.name],
          ["Telefons", values.phone],
          ["E-pasts", values.email],
        ]),
      });
      track("forma", { veids: "kontakti" });
      setSent(res.method);
    } catch {
      setError(`Ziņu neizdevās nosūtīt. Rakstiet uz ${to}.`);
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div className={ui.slip} aria-live="polite">
        <p className={`${ui.label} ${ui.slipHead}`}>Ziņa mums</p>
        <h3 className={ui.sentTitle}>{sent === "mailto" ? "vēstule sagatavota" : "ziņa nosūtīta"}</h3>
        <p className={ui.sentText}>
          {sent === "mailto"
            ? "Jūsu e-pasta programmā atvērās vēstule — nosūtiet to, un mēs atbildēsim. Ja tā neatvērās, rakstiet uz "
            : "Paldies! Atbildēsim uz norādīto e-pastu vai tālruni. Steidzamiem jautājumiem rakstiet uz "}
          <a href={`mailto:${to}`}>{to}</a>.
        </p>
        <button
          type="button"
          className={`${ui.btn} ${ui.btnGhost} ${styles.back}`}
          onClick={() => setSent(null)}
        >
          ← Atpakaļ
        </button>
      </div>
    );
  }

  return (
    <form className={ui.slip} onSubmit={handleSubmit} name="kontakti">
      <p className={`${ui.label} ${ui.slipHead}`}>Ziņa mums</p>
      <p className={ui.slipTitle}>Nosūtiet mums ziņu šeit!</p>

      <div className={ui.formRow}>
        <label className={ui.field}>
          <span>
            Vārds <em>(nepieciešams)</em>
          </span>
          <input id="k-name" name="name" type="text" required autoComplete="name" value={values.name} onChange={update("name")} />
        </label>

        <label className={ui.field}>
          <span>
            Telefona Nr. <em>(nepieciešams)</em>
          </span>
          <input id="k-phone" name="phone" type="tel" required autoComplete="tel" value={values.phone} onChange={update("phone")} />
        </label>
      </div>

      <label className={ui.field}>
        <span>
          E-pasts <em>(nepieciešams)</em>
        </span>
        <input id="k-email" name="email" type="email" required autoComplete="email" value={values.email} onChange={update("email")} />
      </label>

      <label className={ui.field}>
        <span>Ziņojums</span>
        <textarea id="k-message" name="message" rows={6} value={values.message} onChange={update("message")} />
      </label>

      {error && <p className={ui.error}>{error}</p>}

      <button type="submit" className={`${ui.btn} ${ui.submit}`} disabled={busy}>
        {busy ? "Sūta…" : SEND_METHOD === "mailto" ? "Sagatavot vēstuli" : "Sūtīt"}
      </button>
    </form>
  );
}

function Place({ line }) {
  const maps = mapLinks(line);
  return (
    <div className={styles.place}>
      <h3 className={ui.sub}>{line.name}</h3>
      <p className={styles.address}>{fullAddress(line)}</p>
      <ul className={ui.rows}>
        {hoursRows(line, { long: true }).map((r) => (
          <li key={r.label} className={ui.row}>
            <span className={ui.rowLabel}>{r.label}</span>
            <i className={ui.leader} aria-hidden="true" />
            <span className={r.closed ? `${ui.rowValue} ${ui.rowMuted}` : ui.rowValue}>{r.value}</span>
          </li>
        ))}
        {line.phone && (
          <li className={ui.row}>
            <span className={ui.rowLabel}>{line.phoneLabel || "Tālrunis"}</span>
            <i className={ui.leader} aria-hidden="true" />
            <a className={ui.rowValue} href={telHref(line.phone)} onClick={() => track("zvans", { vieta: line.id })}>
              {line.phone}
            </a>
          </li>
        )}
      </ul>
      <p className={`${ui.facts} ${styles.mapLinks}`}>
        <a href={maps.google} target="_blank" rel="noreferrer">
          Google Maps ↗
        </a>
        <a href={maps.waze} target="_blank" rel="noreferrer">
          Waze ↗
        </a>
      </p>
    </div>
  );
}

export default function Kontakti() {
  const places = lines.filter((l) => l.address);

  return (
    <div className={ui.page}>
      <div className={ui.shell}>
        <header className={ui.mast}>
          <h1 className={ui.title}>kontakti</h1>
          <p className={ui.facts}>
            <span>{company.name}</span>
            <span>{company.city}</span>
            <span>kopš {company.founded}</span>
          </p>
        </header>

        <div className={styles.columns}>
          <div className={styles.info}>
            <section aria-labelledby="k-vietas">
              <h2 className={styles.heading} id="k-vietas">
                vietas un darba laiks
              </h2>
              <div className={styles.places}>
                {places.map((l) => (
                  <Place key={l.id} line={l} />
                ))}
              </div>
            </section>

            <section aria-labelledby="k-talruni">
              <h2 className={styles.heading} id="k-talruni">
                tālruņi
              </h2>
              <ul className={ui.rows}>
                {phoneList().map((p) => (
                  <li key={p.value} className={ui.row}>
                    <span className={ui.rowLabel}>{p.label}</span>
                    <i className={ui.leader} aria-hidden="true" />
                    <a className={ui.rowValue} href={telHref(p.value)}>
                      {p.value}
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="k-epasts">
              <h2 className={styles.heading} id="k-epasts">
                e-pasts
              </h2>
              <ul className={ui.rows}>
                {emailList().map((e) => (
                  <li key={e.value} className={styles.stack}>
                    <span className={styles.stackLabel}>{e.label}</span>
                    <a className={styles.stackValue} href={`mailto:${e.value}`}>
                      {e.value}
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="k-rekviziti" id="rekviziti">
              <h2 className={styles.heading} id="k-rekviziti">
                rekvizīti
              </h2>
              <div className={styles.requisites}>
                {company.requisites.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </section>
          </div>

          <div className={styles.side}>
            <ContactForm />
            {ENQUIRY_FORM_ENABLED && (
              <p className={ui.note}>
                Banketu pieteikumus ērtāk sūtīt no <Link to="/banketi#pieteikums">banketu lapas</Link> — tur
                ir lauki datumam, viesu skaitam un vietai.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
