import { useState } from "react";
import { contact } from "../data/site.js";
import styles from "./Kontakti.module.css";

/** One label/value row on the pale-green background. */
function Row({ label, value, wide }) {
  return (
    <div className={wide ? styles.rowWide : styles.row}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function ContactForm() {
  const [sent, setSent] = useState(false);
  const [values, setValues] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const update = (field) => (e) =>
    setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // The original site posted to a Jetpack form endpoint. Until a backend
    // is wired up, hand the message to the visitor's mail client.
    const body = `${values.message}\n\n${values.name}\n${values.phone}\n${values.email}`;
    window.location.href = `mailto:banketins@inbox.lv?subject=${encodeURIComponent(
      "Ziņa no bistro.lv"
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div className={styles.sent}>
        <button
          type="button"
          className={styles.back}
          onClick={() => setSent(false)}
        >
          ← Back
        </button>
        <h4>Jūsu ziņa ir aizsūtīta</h4>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <p className={styles.formTitle}>Nosūtiet mums ziņu šeit!</p>

      <div className={styles.formRow}>
        <label className={styles.field}>
          <span>
            Vārds <em>(nepieciešams)</em>
          </span>
          <input
            type="text"
            required
            value={values.name}
            onChange={update("name")}
          />
        </label>

        <label className={styles.field}>
          <span>
            Telefona Nr. <em>(nepieciešams)</em>
          </span>
          <input
            type="tel"
            required
            value={values.phone}
            onChange={update("phone")}
          />
        </label>
      </div>

      <label className={styles.field}>
        <span>
          E-pasts <em>(nepieciešams)</em>
        </span>
        <input
          type="email"
          required
          value={values.email}
          onChange={update("email")}
        />
      </label>

      <label className={styles.field}>
        <span>Ziņojums</span>
        <textarea rows={7} value={values.message} onChange={update("message")} />
      </label>

      <button type="submit" className={`btn ${styles.submit}`}>
        Sūtīt
      </button>
    </form>
  );
}

export default function Kontakti() {
  return (
    <div className={styles.page}>
      <div className={styles.columns}>
        <div className={styles.info}>
          <h1 className={styles.heading}>DARBA LAIKS</h1>
          {contact.hours.map((group) => (
            <div key={group.place} className={styles.group}>
              <p className={styles.place}>{group.place}</p>
              {group.rows.map(([label, value]) => (
                <Row key={label} label={label} value={value} />
              ))}
            </div>
          ))}

          <h2 className={styles.heading}>Tālruņi</h2>
          <div className={styles.group}>
            {contact.phones.map(([label, value]) => (
              <Row
                key={label}
                label={label}
                value={
                  <a href={`tel:${value.replace(/\s/g, "")}`}>{value}</a>
                }
              />
            ))}
          </div>

          <h2 className={styles.heading}>Adreses</h2>
          <div className={styles.group}>
            {contact.addresses.map(([label, value]) => (
              <Row key={label} label={label} value={value} wide />
            ))}
          </div>

          <h2 className={styles.heading}>E-pasts</h2>
          <div className={styles.group}>
            {contact.emails.map(([label, value]) => (
              <Row
                key={label}
                label={label}
                value={<a href={`mailto:${value}`}>{value}</a>}
                wide
              />
            ))}
          </div>

          <h2 className={styles.heading}>Rekvizīti</h2>
          <div className={styles.requisites}>
            {contact.requisites.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>

        <div className={styles.side}>
          <ContactForm />
          <iframe
            className={styles.map}
            src={contact.mapSrc}
            title="Karte — Driksas iela 7, Jelgava"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
