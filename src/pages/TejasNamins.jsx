import FancyCarousel from "../components/FancyCarousel.jsx";
import Img from "../components/Img.jsx";
import Masthead from "../components/Masthead.jsx";
import Notice from "../components/Notice.jsx";
import Paragraphs from "../components/Paragraphs.jsx";
import { lineById, useSite, useTexts } from "../lib/content.jsx";
import ui from "../styles/Page.module.css";
import styles from "./TejasNamins.module.css";

export default function TejasNamins() {
  const site = useSite();
  const t = useTexts();
  const line = lineById(site, "tejas-namins");
  const promo = site.notices?.["tejas-namins"];
  const gallery = site.galleries.tejasNamins;
  const hasGallery = gallery?.images.length > 0;

  return (
    <div className={ui.page} data-cluster={line.cluster}>
      <div className={ui.shell}>
        <Masthead line={line} />

        <section className={ui.section} aria-label="Par tējas namiņu">
          {/* ievads pilnā platumā, zem tā foto un plakāts vienā rindā, vienā augstumā */}
          <div className={styles.intro}>
            <Paragraphs text={t("tejas.intro")} />
          </div>

          {/* bez aktualitātes foto aizņem visu rindu — nav tukšas vietas */}
          <div className={promo ? styles.pair : `${styles.pair} ${styles.pairSolo}`}>
            <div className={styles.wideFrame}>
              <Img
                className={styles.wideShot}
                image={site.photos["tejas.wide"]}
                sizes={promo ? "(min-width: 700px) 494px, 100vw" : "(min-width: 1040px) 1000px, 100vw"}
                loading="eager"
              />
            </div>
            {promo && <Notice {...promo} sizes="(min-width: 700px) 460px, 100vw" />}
          </div>
        </section>

        {hasGallery && (
          <section className={ui.section} aria-labelledby="tejas-galerija">
            <div className={`${ui.sectionHead} ${styles.galleryHead}`}>
              <h2 className={ui.heading} id="tejas-galerija">
                {t("tejas.gallery.heading")}
              </h2>
            </div>
          </section>
        )}
      </div>

      {/* lente iet ārpus satura platuma, tāpēc tā stāv ārpus čaulas */}
      {hasGallery && (
        <div className={styles.rail}>
          <div className={ui.shell}>
            {/* key: ja bilžu skaits mainās (tiešie dati), lente sākas no jauna */}
            <FancyCarousel key={gallery.images.length} images={gallery.images} alt={gallery.title} />
          </div>
        </div>
      )}
    </div>
  );
}
