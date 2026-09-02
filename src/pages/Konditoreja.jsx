import { useState } from "react";
import categories from "../data/konditoreja.json";
import styles from "./Konditoreja.module.css";

function CategoryMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.menuWrap}>
      <button
        type="button"
        className={styles.menuButton}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        IZVĒLNE
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
          className={open ? styles.chevronOpen : styles.chevron}
        >
          <path d="M1.5 4L6 8L10.5 4" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      {open && (
        <ul className={styles.submenu}>
          {categories.map((cat) => (
            <li key={cat.id}>
              <a href={`#${cat.id}`} onClick={() => setOpen(false)}>
                {cat.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ProductCard({ item }) {
  return (
    <li className={styles.card}>
      {item.img && (
        <img src={`/img/${item.img}`} alt={item.name} loading="lazy" />
      )}
      <div className={styles.body}>
        <p className={styles.name}>{item.name}</p>
        {item.desc && <p className={styles.desc}>{item.desc}</p>}
        <div className={styles.meta}>
          {item.weight && <span className={styles.weight}>{item.weight}</span>}
          {item.price && <span>{item.price}</span>}
        </div>
      </div>
    </li>
  );
}

export default function Konditoreja() {
  return (
    <div className={styles.page}>
      <CategoryMenu />

      {categories.map((cat) => (
        <section key={cat.id} className={styles.section}>
          <h2 id={cat.id} className={styles.heading}>
            {cat.title}
          </h2>
          {cat.note && <p className={styles.note}>{cat.note}</p>}
          <hr className="rule" />
          <ul className={styles.grid}>
            {cat.items.map((item) => (
              <ProductCard key={item.name + item.img} item={item} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
