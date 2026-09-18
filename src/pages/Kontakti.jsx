import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { company, lines, hoursRows, mapLinks, telHref } from "../data/lines.js";
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

/** Google Maps iegultā karte bez API atslēgas — "q=…&output=embed". */
function mapEmbedSrc(line) {
  const q = encodeURIComponent(`Silva ${line.name}, ${line.address.street}, ${line.address.city}, Latvia`);
  return `https://www.google.com/maps?q=${q}&z=16&hl=lv&output=embed`;
}

/**
 * Viena vieta kā kartīte: nosaukums, adrese (poga — parāda vietu kartē),
 * darba laiks tabulā, tālrunis apakšā vienā līmenī visās kartītēs.
 */
function Place({ line, selected, onSelect }) {
  return (
    <li className={selected ? `${styles.card} ${styles.cardSelected}` : styles.card}>
      <h3 className={styles.cardName}>{line.name}</h3>
      <button
        type="button"
        className={styles.address}
        aria-pressed={selected}
        onClick={() => onSelect(line.id)}
        title="Parādīt kartē"
      >
        {line.address.street}
        <br />
        {line.address.city}, {line.address.postal}
        <span className={styles.addressHint}>{selected ? "kartē ↓" : "parādīt kartē ↓"}</span>
      </button>

      <dl className={styles.hours}>
        {hoursRows(line, { long: true }).map((r) => (
          <div key={r.label} className={styles.hoursRow}>
            <dt>{r.label}</dt>
            <dd className={r.closed ? styles.closed : undefined}>{r.value}</dd>
          </div>
        ))}
      </dl>

      {line.phone && (
        <div className={styles.cardFoot}>
          <a className={styles.phone} href={telHref(line.phone)} onClick={() => track("zvans", { vieta: line.id })}>
            {line.phone}
          </a>
        </div>
      )}
    </li>
  );
}

export default function Kontakti() {
  const places = lines.filter((l) => l.address);
  const banketi = lines.find((l) => l.id === "banketi");
  const [selectedId, setSelectedId] = useState(places[0].id);
  const selected = places.find((l) => l.id === selectedId) ?? places[0];
  const mapRef = useRef(null);

  const select = (id) => {
    setSelectedId(id);
    track("karte", { vieta: id });
    // uz telefona karte ir zem kartītēm — aizritinām līdz tai
    mapRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  return (
    <div className={ui.page}>
      <div className={ui.shell}>
        <header className={`${ui.mast} ${ui.mastBare}`}>
          <h1 className={ui.title}>kontakti</h1>
        </header>

        {/* ---------- vietas: trīs kartītes vienā rindā ---------- */}
        <section className={styles.block} aria-label="Vietas un darba laiks">
          <ul className={styles.cards}>
            {places.map((l) => (
              <Place key={l.id} line={l} selected={l.id === selectedId} onSelect={select} />
            ))}
          </ul>

          {/* karte — rāda izvēlēto vietu; adrese kartītē to pārslēdz */}
          <div className={styles.map} ref={mapRef}>
            <div className={styles.mapHead}>
              <p className={styles.mapTitle}>
                <span>Silva, {selected.name}</span>
                <span className={styles.mapAddress}>
                  {selected.address.street}, {selected.address.city}, {selected.address.postal}
                </span>
              </p>
              <a className={styles.mapOpen} href={mapLinks(selected).google} target="_blank" rel="noreferrer">
                Atvērt Google Maps ↗
              </a>
            </div>
            <iframe
              key={selected.id}
              className={styles.mapFrame}
              src={mapEmbedSrc(selected)}
              title={`Karte: Silva ${selected.name}, ${selected.address.street}`}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>

        {/* ---------- banketi + rekvizīti | forma ---------- */}
        <div className={styles.columns}>
          <div className={styles.info}>
            <section className={styles.block} aria-labelledby="k-banketi">
              <h2 className={styles.label} id="k-banketi">
                banketi un pasākumi
              </h2>
              <div className={styles.card}>
                <h3 className={styles.cardName}>{banketi.name}</h3>
                <p className={styles.cardText}>Pasākumu ēdināšana, telpu noma, konditorejas pasūtījumi.</p>
                <a className={styles.phone} href={telHref(banketi.phone)} onClick={() => track("zvans", { vieta: "banketi" })}>
                  {banketi.phone}
                </a>
                <a className={styles.email} href={`mailto:${banketi.email}`}>
                  {banketi.email}
                </a>
                <p className={styles.links}>
                  <Link to="/banketi">banketi →</Link>
                  <Link to="/noma">telpu noma →</Link>
                </p>
              </div>
            </section>

            <section className={styles.block} aria-labelledby="k-atsauksmes">
              <h2 className={styles.label} id="k-atsauksmes">
                atsauksmēm un jautājumiem
              </h2>
              <div className={styles.plain}>
                <a className={styles.phone} href={telHref(company.feedbackPhone)}>
                  {company.feedbackPhone}
                </a>
                <a className={styles.email} href={`mailto:${company.feedbackEmail}`}>
                  {company.feedbackEmail}
                </a>
              </div>
            </section>

            <section className={styles.block} aria-labelledby="k-rekviziti" id="rekviziti">
              <h2 className={styles.label} id="k-rekviziti">
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
