import { Link } from "react-router-dom";
import Gallery from "../components/Gallery.jsx";
import Img from "../components/Img.jsx";
import Paragraphs from "../components/Paragraphs.jsx";
import PriceRows from "../components/PriceRows.jsx";
import Slideshow from "../components/Slideshow.jsx";
import { textLines, useSite, useTexts, venueById } from "../lib/content.jsx";
import ui from "../styles/Page.module.css";
import styles from "./Noma.module.css";

/** Pontons un peldterase — viens un tas pats bloks. */
function Venue({ venue, gallery, children }) {
  const t = useTexts();
  const id = `noma-${venue.id}`;
  const images = gallery?.images || [];
  return (
    <section className={ui.section} aria-labelledby={id}>
      <div className={ui.sectionHead}>
        <h2 className={ui.heading} id={id}>
          {venue.name}
        </h2>
        <p className={ui.facts}>
          <span>līdz {venue.capacity} personām</span>
          {venue.href && (
            <a href={venue.href} target="_blank" rel="noreferrer">
              {venue.site} ↗
            </a>
          )}
        </p>
      </div>

      <div className={`${ui.prose} ${styles.venueText}`}>{children}</div>

      <div className={styles.venuePhotos}>
        <Img
          className={styles.venueMain}
          image={venue.image}
          name={venue.photo}
          alt={venue.alt}
          sizes="(min-width: 700px) 494px, 100vw"
        />
        {images.length > 0 && <Gallery images={images} alt={venue.name} featured={4} columns={2} />}
      </div>

      <div className={`${ui.actions} ${styles.venueActions}`}>
        {venue.href && (
          <a className={`${ui.btn} ${ui.btnGhost}`} href={venue.href} target="_blank" rel="noreferrer">
            {t("noma.more.button")} ↗
          </a>
        )}
        <Link className={ui.btn} to="/kontakti#forma">
          {t("noma.button")}
        </Link>
      </div>
    </section>
  );
}

export default function Noma() {
  const site = useSite();
  const t = useTexts();
  const zale = venueById(site, "zale");
  const pontons = venueById(site, "pontons");
  const peldterase = venueById(site, "peldterase");
  const hall = site.galleries.banketuZale;
  // zāles īres cenas no admin: nosaukums ........ cena
  const prices = site.rentalPrices;

  return (
    <div className={ui.page} data-cluster="banketi">
      <div className={ui.shell}>
        <header className={`${ui.mast} ${ui.mastBare}`}>
          <h1 className={ui.title}>telpu noma</h1>
        </header>

        {/* ---------------- Zāle ---------------- */}
        {zale && (
        <section className={ui.section} aria-labelledby="noma-zale">
          <div className={ui.sectionHead}>
            <h2 className={ui.heading} id="noma-zale">
              {zale.title}
            </h2>
          </div>

          <div className={styles.hall}>
            <div className={ui.prose}>
              <Paragraphs text={t("noma.zale.text")} />
              <p>
                <strong>{t("noma.zale.equipment.title")}</strong>
              </p>
              <ul className={ui.list}>
                {textLines(t("noma.zale.equipment")).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Paragraphs text={t("noma.zale.text2")} />
            </div>

            <div className={styles.hallMedia}>
              {hall?.images.length > 0 && <Slideshow images={hall.images} alt={hall.title} />}
            </div>
          </div>
        </section>
        )}

        {/* ---------------- Cenas ---------------- */}
        {prices.length > 0 && (
        <section className={ui.section} aria-labelledby="noma-cenas">
          <div className={ui.sectionHead}>
            <h2 className={ui.heading} id="noma-cenas">
              {t("noma.prices.heading")}
            </h2>
          </div>

          <div className={styles.prices}>
            {prices.map((group) => (
              <div key={group.title}>
                <h3 className={ui.sub}>
                  {group.title}
                  {group.note && <em> ({group.note})</em>}
                </h3>
                <PriceRows rows={group.rows} ariaLabel={group.title} />
              </div>
            ))}
          </div>
          <div className={`${ui.actions} ${styles.venueActions}`}>
            <Link className={ui.btn} to="/kontakti#forma">
              {t("noma.button")}
            </Link>
          </div>
        </section>
        )}

        {/* ---------------- Pontons ---------------- */}
        {pontons && (
          <Venue venue={pontons} gallery={site.galleries.pontons}>
            <Paragraphs text={t("noma.pontons.text")} />
          </Venue>
        )}

        {/* ---------------- Peldterase ---------------- */}
        {peldterase && (
          <Venue venue={peldterase} gallery={site.galleries.peldterase}>
            <Paragraphs text={t("noma.peldterase.text")} />
          </Venue>
        )}
      </div>
    </div>
  );
}
