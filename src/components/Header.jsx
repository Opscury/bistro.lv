import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { nav } from "../data/site.js";
import styles from "./Header.module.css";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // close the mobile menu whenever we navigate
  useEffect(() => setOpen(false), [pathname]);

  // lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className={styles.sticky}>
      <div className={styles.bar}>
        <header className={styles.inner}>
          <Link to="/" className={styles.logo} aria-label="Silva — sākumlapa">
            <img src="/img/silva_logo.webp" alt="Silva" width="140" height="70" />
          </Link>

          <button
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls="site-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="visually-hidden">Izvēlne</span>
            <span className={styles.bars} aria-hidden="true" />
          </button>

          <nav
            id="site-nav"
            className={`${styles.nav} ${open ? styles.navOpen : ""}`}
          >
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive ? `${styles.link} ${styles.active}` : styles.link
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>
        <hr className={styles.rule} />
      </div>
    </div>
  );
}
