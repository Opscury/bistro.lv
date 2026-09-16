import { Link } from "react-router-dom";
import Gallery from "../components/Gallery.jsx";
import Img from "../components/Img.jsx";
import Masthead from "../components/Masthead.jsx";
import { lineById } from "../data/lines.js";
import { galleries, tejasOffer } from "../data/site.js";
import ui from "../styles/Page.module.css";
import styles from "./TejasNamins.module.css";

export default function TejasNamins() {
  const line = lineById["tejas-namins"];

  return (
    <div className={ui.page} data-cluster={line.cluster}>
      <div className={ui.shell}>
        <Masthead line={line} />

        <section className={ui.section} aria-label="Par tējas namiņu">
          <div className={styles.intro}>
            <div className={styles.textCol}>
              <div className={ui.prose}>
                {tejasOffer.intro.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <Img
                className={styles.wideShot}
                name={tejasOffer.wideShot}
                alt="Tējas namiņš vasarā starp kokiem Pasta salā"
                sizes="(min-width: 700px) 494px, 100vw"
                loading="eager"
              />
            </div>

            <Img
              className={styles.poster}
              name={tejasOffer.poster.photo}
              alt={tejasOffer.poster.alt}
              sizes="(min-width: 700px) 494px, 100vw"
            />
          </div>
        </section>

        <section className={ui.section} aria-labelledby="tejas-galerija">
          <div className={ui.sectionHead}>
            <h2 className={ui.heading} id="tejas-galerija">
              galerija
            </h2>
          </div>
          <Gallery images={galleries.tejasNamins} alt="Tējas namiņš" featured={8} columns={4} />
        </section>

        <div className={ui.cta}>
          <div>
            <h2 className={ui.ctaTitle}>kontakti</h2>
            <p className={ui.ctaText}>Adreses, darba laiki un tālruņi visām Silva vietām.</p>
          </div>
          <Link className={ui.btn} to="/kontakti">
            Visi kontakti
          </Link>
        </div>
      </div>
    </div>
  );
}
