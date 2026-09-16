import { useState } from "react";
import { sendForm, fieldsToText, SEND_METHOD } from "../lib/sendForm.js";
import { telHref } from "../data/lines.js";
import { track } from "../lib/analytics.js";
import ui from "../styles/Page.module.css";

const EMPTY = { name: "", phone: "", email: "", date: "", guests: "", type: "", venue: "", message: "" };

const TYPES = [
  "kāzas", "jubileja", "kristības", "bildināšana", "atvadu mielasts",
  "korporatīvais pasākums", "seminārs vai konference", "kafijas pauze", "cits",
];

const VENUES = [
  "Bistro Silva zāle (līdz 90)",
  "Pontons (līdz 30)",
  "Peldterase (līdz 40)",
  "Citur — izbraukums",
  "Vēl nezinu",
];

/**
 * Banketu pieteikums: datums, viesu skaits, pasākuma veids, vieta —
 * tas, ko banketu vadītājai vajag, lai atbildētu ar piedāvājumu, nevis
 * ar jautājumiem. Sūta caur lib/sendForm.js.
 */
export default function EnquiryForm({ line }) {
  const [values, setValues] = useState(EMPTY);
  const [sent, setSent] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const update = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const body = fieldsToText([
      ["Pasākums", values.type],
      ["Datums", values.date],
      ["Viesu skaits", values.guests],
      ["Vieta", values.venue],
      ["Vārds", values.name],
      ["Telefons", values.phone],
      ["E-pasts", values.email],
      ["Ziņa", values.message],
    ]);
    try {
      const res = await sendForm("banketi", values, {
        to: line.email,
        subject: `Banketu pieteikums — ${values.name}${values.date ? ` — ${values.date}` : ""}`,
        body,
      });
      track("forma", { veids: "banketi" });
      setSent(res.method);
    } catch {
      setError(`Pieteikumu neizdevās nosūtīt. Lūdzam zvanīt ${line.phone} vai rakstīt uz ${line.email}.`);
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div className={ui.slip} aria-live="polite">
        <p className={`${ui.label} ${ui.slipHead}`}>Pieteikums</p>
        <h3 className={ui.sentTitle}>{sent === "mailto" ? "vēstule sagatavota" : "pieteikums saņemts"}</h3>
        <p className={ui.sentText}>
          {sent === "mailto"
            ? "Jūsu e-pasta programmā atvērās vēstule ar pieteikumu — nosūtiet to, un mēs atbildēsim ar piedāvājumu."
            : "Paldies! Iepazīsimies ar pieteikumu un atbildēsim ar piedāvājumu."}{" "}
          Steidzamiem jautājumiem: <a href={telHref(line.phone)}>{line.phone}</a>.
        </p>
        <button
          type="button"
          className={`${ui.btn} ${ui.btnGhost}`}
          style={{ alignSelf: "flex-start", marginTop: 18 }}
          onClick={() => {
            setValues(EMPTY);
            setSent(null);
          }}
        >
          ← Jauns pieteikums
        </button>
      </div>
    );
  }

  return (
    <form className={ui.slip} onSubmit={handleSubmit} name="banketi" id="pieteikums-forma">
      <p className={`${ui.label} ${ui.slipHead}`}>Pieteikums</p>
      <p className={ui.slipTitle}>Pastāstiet par pasākumu — atbildēsim ar piedāvājumu.</p>

      <div className={ui.formRow}>
        <label className={ui.field}>
          <span>Pasākums</span>
          <select id="enq-type" name="type" value={values.type} onChange={update("type")}>
            <option value="">— izvēlieties —</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className={ui.field}>
          <span>Datums</span>
          <input id="enq-date" name="date" type="date" value={values.date} onChange={update("date")} />
        </label>
      </div>

      <div className={ui.formRow}>
        <label className={ui.field}>
          <span>Viesu skaits</span>
          <input id="enq-guests" name="guests" type="number" min="1" inputMode="numeric" value={values.guests} onChange={update("guests")} />
        </label>
        <label className={ui.field}>
          <span>Vieta</span>
          <select id="enq-venue" name="venue" value={values.venue} onChange={update("venue")}>
            <option value="">— izvēlieties —</option>
            {VENUES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={ui.formRow}>
        <label className={ui.field}>
          <span>
            Vārds <em>(nepieciešams)</em>
          </span>
          <input id="enq-name" name="name" type="text" required autoComplete="name" value={values.name} onChange={update("name")} />
        </label>
        <label className={ui.field}>
          <span>
            Telefona Nr. <em>(nepieciešams)</em>
          </span>
          <input id="enq-phone" name="phone" type="tel" required autoComplete="tel" value={values.phone} onChange={update("phone")} />
        </label>
      </div>

      <label className={ui.field}>
        <span>
          E-pasts <em>(nepieciešams)</em>
        </span>
        <input id="enq-email" name="email" type="email" required autoComplete="email" value={values.email} onChange={update("email")} />
      </label>

      <label className={ui.field}>
        <span>Ziņa</span>
        <textarea id="enq-message" name="message" rows={4} value={values.message} onChange={update("message")} placeholder="Vēlmes ēdienkartei, alerģijas, laiks, viss, kas mums jāzina" />
      </label>

      {error && <p className={ui.error}>{error}</p>}

      <button type="submit" className={`${ui.btn} ${ui.submit}`} disabled={busy}>
        {busy ? "Sūta…" : SEND_METHOD === "mailto" ? "Sagatavot vēstuli" : "Nosūtīt pieteikumu"}
      </button>
    </form>
  );
}
