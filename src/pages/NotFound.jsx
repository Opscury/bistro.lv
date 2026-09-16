import { Link } from "react-router-dom";
import { nav } from "../data/site.js";
import ui from "../styles/Page.module.css";

export default function NotFound() {
  return (
    <div className={ui.page}>
      <div className={ui.shell}>
        <header className={ui.mast}>
          <h1 className={ui.title}>lapa nav atrasta</h1>
          <p className={ui.lead}>
            Šādas lapas nav — varbūt saite ir novecojusi. Viss, kas ir, ir šeit:
          </p>
        </header>
        <section className={ui.section} aria-label="Vietnes lapas">
          <ul className={ui.rows}>
            <li className={ui.row}>
              <Link className={ui.rowLabel} to="/">sākumlapa</Link>
              <i className={ui.leader} aria-hidden="true" />
              <span className={`${ui.rowValue} ${ui.rowMuted}`}>/</span>
            </li>
            {nav.map((n) => (
              <li key={n.to} className={ui.row}>
                <Link className={ui.rowLabel} to={n.to}>{n.label.toLowerCase()}</Link>
                <i className={ui.leader} aria-hidden="true" />
                <span className={`${ui.rowValue} ${ui.rowMuted}`}>{n.to}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
