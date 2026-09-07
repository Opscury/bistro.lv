import { formatRange } from "../../data/konditorejaUnits.js";
import styles from "../../pages/Konditoreja.module.css";

/**
 * Josla lapas apakšā, kamēr ieslēgts pasūtīšanas režīms. Tā vienlaikus
 * paskaidro, kāpēc parādījušās pievienošanas pogas, un ved uz pasūtījuma lapu.
 */
export default function CartBar({ cart, onOpen, onExit }) {
  const n = cart.lines.length;

  return (
    <div className={styles.cartBar} role="region" aria-label="Pasūtījuma lapa">
      <div className={styles.cartBarInner}>
        <p className={styles.cartBarText}>
          {n === 0 ? (
            <span>Atzīmējiet preces piedāvājumā</span>
          ) : (
            <>
              <span>
                {n} {n === 1 ? "prece" : "preces"}
              </span>
              <span className={styles.cartBarSum}>
                ≈ {formatRange(cart.total.min, cart.total.max)}
                {cart.total.unknown ? " +" : ""}
              </span>
            </>
          )}
        </p>

        <div className={styles.cartBarActions}>
          <button
            type="button"
            className={styles.exitBtn}
            onClick={onExit}
            title="Preces paliek saglabātas"
          >
            Iziet
          </button>
          <button type="button" className={styles.btn} onClick={onOpen}>
            Pasūtījuma lapa
          </button>
        </div>
      </div>
    </div>
  );
}
