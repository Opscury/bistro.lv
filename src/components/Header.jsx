import { useState, useEffect, useRef } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { nav } from "../data/site.js";
import styles from "./Header.module.css";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const barRef = useRef(null);
  const toggleRef = useRef(null);

  // aizver mobilo izvēlni, mainot lapu
  useEffect(() => setOpen(false), [pathname]);

  // galvenes augstums -> --header-h (enkuriem un lipīgajām joslām)
  useEffect(() => {
    const el = barRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const set = () =>
      document.documentElement.style.setProperty("--header-h", `${el.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // kamēr izvēlne vaļā: nescrollo, Escape aizver, klikšķis ārpusē aizver
  useEffect(() => {
    if (!open) return;
    document.body.classList.add("no-scroll");
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onDown = (e) => {
      if (barRef.current && !barRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.body.classList.remove("no-scroll");
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <div className={styles.sticky}>
      <div className={styles.bar} ref={barRef}>
        <header className={styles.inner}>
          <Link to="/" className={styles.logo} aria-label="Silva — sākumlapa">
            <img src="/silva-logo.svg" alt="Silva" width="96" height="49" />
          </Link>

          <button
            type="button"
            className={open ? `${styles.toggle} ${styles.toggleOpen}` : styles.toggle}
            aria-expanded={open}
            aria-controls="site-nav"
            onClick={() => setOpen((v) => !v)}
            ref={toggleRef}
          >
            <span className="visually-hidden">{open ? "Aizvērt izvēlni" : "Izvēlne"}</span>
            <span className={styles.bars} aria-hidden="true" />
          </button>

          <nav
            id="site-nav"
            className={`${styles.nav} ${open ? styles.navOpen : ""}`}
            aria-label="Galvenā izvēlne"
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
