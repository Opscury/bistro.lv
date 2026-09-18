import FancyCarousel from "../components/FancyCarousel.jsx";
import TejasHero from "../components/TejasHero.jsx";
import { lineById } from "../data/lines.js";
import { galleries, tejasNotice, tejasOffer } from "../data/site.js";
import ui from "../styles/Page.module.css";
import styles from "./TejasNamins.module.css";

export default function TejasNamins() {
  const line = lineById["tejas-namins"];

  return (
    <div className={ui.page} data-cluster={line.cluster}>
      {/* galva iet visā lapas platumā, tāpēc tā stāv ārpus čaulas */}
      <TejasHero title={line.name} intro={tejasOffer.intro} notice={tejasNotice} />

      <div className={ui.shell}>
        <section className={styles.gallerySection} aria-labelledby="tejas-galerija">
          <div className={`${ui.sectionHead} ${styles.galleryHead}`}>
            <h2 className={ui.heading} id="tejas-galerija">
              galerija
            </h2>
          </div>
        </section>
      </div>

      <div className={styles.rail}>
        <div className={ui.shell}>
          <FancyCarousel images={galleries.tejasNamins} alt="Tējas namiņš" />
        </div>
      </div>
    </div>
  );
}
