import ui from "../styles/Page.module.css";

/**
 * nosaukums (svars) ........ cena — tas pats zīmējums, kas Telpu nomas
 * cenās, tagad arī saldējumam, kokteiļiem un bistro ēdienkartei.
 * rows: [{ name, size?, price, tag?, tagSoft?, muted? }]
 */
export default function PriceRows({ rows, ariaLabel }) {
  return (
    <ul className={ui.rows} aria-label={ariaLabel}>
      {rows.map((r, i) => (
        <li key={`${r.name}-${i}`} className={ui.row}>
          <span className={ui.rowLabel}>
            {r.name}
            {r.size && <small>{r.size}</small>}
            {r.tag && (
              <span className={r.tagSoft ? `${ui.tag} ${ui.tagSoft}` : ui.tag}>{r.tag}</span>
            )}
          </span>
          <i className={ui.leader} aria-hidden="true" />
          <span className={r.muted ? `${ui.rowValue} ${ui.rowMuted}` : ui.rowValue}>
            {r.price}
          </span>
        </li>
      ))}
    </ul>
  );
}
