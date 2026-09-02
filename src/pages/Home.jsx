import { Link } from "react-router-dom";
import { homeTiles } from "../data/site.js";
import styles from "./Home.module.css";

function Tile({ tile }) {
  const inner = (
    <>
      <img
        className={styles.photo}
        src={`/img/${tile.photo}.webp`}
        alt={tile.alt}
        loading="lazy"
      />
      <img
        className={styles.label}
        src={`/img/${tile.label}.webp`}
        alt=""
        loading="lazy"
      />
    </>
  );

  return tile.to ? (
    <Link className={styles.tile} to={tile.to}>
      {inner}
    </Link>
  ) : (
    <a
      className={styles.tile}
      href={tile.href}
      target="_blank"
      rel="noreferrer"
    >
      {inner}
    </a>
  );
}

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.grid}>
        {homeTiles.map((tile) => (
          <Tile key={tile.photo} tile={tile} />
        ))}
      </div>
    </div>
  );
}
