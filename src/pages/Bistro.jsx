import { bistroMenus } from "../data/site.js";
import styles from "./Bistro.module.css";

function MenuCard({ item }) {
  return (
    <div className={styles.card}>
      <img src={`/img/${item.photo}.webp`} alt={item.alt} loading="lazy" />
      <a
        className={styles.cardLink}
        href={item.pdf}
        target="_blank"
        rel="noreferrer"
      >
        <img src={`/img/${item.label}.webp`} alt={`${item.alt} (PDF)`} />
      </a>
    </div>
  );
}

export default function Bistro() {
  return (
    <div className={styles.page}>
      <h1 className={`page-title ${styles.title}`}>BISTRO</h1>

      <div className={styles.menus}>
        {bistroMenus.map((item) => (
          <MenuCard key={item.photo} item={item} />
        ))}
      </div>

      <div className={styles.lower}>
        <div className={styles.groupCol}>
          <img
            src="/img/grupu_edinasana_bilde.webp"
            alt="Grupu ēdināšana"
            loading="lazy"
          />
          <img
            className={styles.groupLabel}
            src="/img/poga_grupu.webp"
            alt=""
            loading="lazy"
          />
          <a
            className={`btn ${styles.news}`}
            href="https://www.instagram.com/bistro_silva/"
            target="_blank"
            rel="noreferrer"
          >
            AKTUALITĀTES
          </a>
        </div>

        <div className={styles.iceCol}>
          <img
            src="/img/Saldejums-konditoreja.webp"
            alt="Saldējums"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
