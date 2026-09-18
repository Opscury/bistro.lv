import { Link, useLocation } from "react-router-dom";
import { company, lines, hoursRows, telHref } from "../data/lines.js";
import styles from "./Footer.module.css";

/**
 * Kājene četru vietu uzņēmumam: katra vieta ar adresi un laiku, divi
 * tālruņi, Instagram, "Silva · Jelgava · kopš 1994" un rekvizīti.
 * Vietu režģis ir tikai sākumlapā — citās lapās paliek apakšējā rinda.
 * Gads ir aprēķināts — nekad vairs "2020".
 */
export default function Footer() {
  const { pathname } = useLocation();
  const showPlaces = pathname === "/";
  const year = new Date().getFullYear();
  const places = lines.filter((l) => l.address);
  const banketi = lines.find((l) => l.id === "banketi");

  return (
    <footer className={styles.footer}>
      <hr className={styles.rule} />

      <div className={styles.inner}>
        {showPlaces && (
        <div className={styles.grid}>
          {places.map((l) => (
            <div key={l.id} className={styles.col}>
              <Link to={l.path} className={styles.colTitle}>
                {l.name}
              </Link>
              <p className={styles.mono}>
                {l.address.street}
                <br />
                {hoursRows(l).map((r) => (
                  <span key={r.label} className={styles.line}>
                    {r.label} {r.value}
                  </span>
                ))}
                {l.phone && (
                  <a className={styles.line} href={telHref(l.phone)}>
                    {l.phone}
                  </a>
                )}
              </p>
            </div>
          ))}

          <div className={styles.col}>
            <Link to={banketi.path} className={styles.colTitle}>
              {banketi.name}
            </Link>
            <p className={styles.mono}>
              <a className={styles.line} href={telHref(banketi.phone)}>
                {banketi.phone}
              </a>
              <a className={styles.line} href={`mailto:${banketi.email}`}>
                {banketi.email}
              </a>
              <Link className={styles.line} to="/noma">
                telpu noma →
              </Link>
            </p>
          </div>
        </div>
        )}
      </div>

      {showPlaces && <hr className={`${styles.rule} ${styles.ruleGap}`} />}

      <div className={`${styles.inner} ${styles.innerBottom}`}>
        <div className={showPlaces ? styles.bottom : `${styles.bottom} ${styles.bottomOnly}`}>
          <p className={styles.facts}>
            <span>{company.name}</span>
            <span>{company.city}</span>
            <span>kopš {company.founded}</span>
            <a href={company.instagram} target="_blank" rel="noreferrer">
              Instagram {company.instagramHandle}
            </a>
          </p>
          <p className={styles.legal}>
            © {year} {company.legalName} · <Link to="/kontakti#rekviziti">rekvizīti</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
