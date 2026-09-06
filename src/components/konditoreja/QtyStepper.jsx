import { useEffect, useState } from "react";
import { formatQty } from "../../data/konditorejaUnits.js";
import styles from "../../pages/Konditoreja.module.css";

const round = (n, d) => Math.round(n * 10 ** d) / 10 ** d;

/**
 * − [daudzums] + . Nokāpjot zem minimuma, prece tiek izņemta no groza
 * (onChange(null)), jo mazāk par minimumu Silva nepieņem.
 */
export default function QtyStepper({ p, qty, onChange, name, compact }) {
  const [text, setText] = useState(String(qty));

  useEffect(() => setText(String(qty)), [qty]);

  const atMin = qty <= p.minQty + 1e-9;

  const step = (dir) => {
    const next = round(qty + dir * p.step, p.decimals);
    onChange(next < p.minQty - 1e-9 ? null : Math.max(next, p.minQty));
  };

  const commit = () => {
    const parsed = parseFloat(text.replace(",", "."));
    if (Number.isNaN(parsed) || parsed < p.minQty) {
      setText(String(qty));
      return;
    }
    onChange(round(parsed, p.decimals));
  };

  return (
    <div className={compact ? styles.stepperCompact : styles.stepper}>
      <button
        type="button"
        onClick={() => step(-1)}
        aria-label={atMin ? `Izņemt ${name} no groza` : `Samazināt: ${name}`}
      >
        {atMin ? "✕" : "−"}
      </button>

      <label className={styles.stepperValue}>
        <span className="visually-hidden">Daudzums: {name}</span>
        <input
          type="number"
          inputMode="decimal"
          min={p.minQty}
          step={p.step}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), commit())}
        />
        <span aria-hidden="true">{p.unitLabel}</span>
      </label>

      <button
        type="button"
        onClick={() => step(1)}
        aria-label={`Palielināt: ${name}`}
      >
        +
      </button>

      <span className="visually-hidden">{formatQty(qty, p)}</span>
    </div>
  );
}
