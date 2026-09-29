import { Link } from "react-router-dom";
import EnquiryForm from "../components/EnquiryForm.jsx";
import Gallery from "../components/Gallery.jsx";
import Masthead from "../components/Masthead.jsx";
import Paragraphs from "../components/Paragraphs.jsx";
import { telHref } from "../data/lines.js";
import { lineById, useSite, useTexts } from "../lib/content.jsx";
import { track } from "../lib/analytics.js";
import { ENQUIRY_FORM_ENABLED } from "../lib/features.js";
import ui from "../styles/Page.module.css";
import styles from "./Banketi.module.css";

export default function Banketi() {
  const site = useSite();
  const t = useTexts();
  const line = lineById(site, "banketi");
  const { venues } = site;
  // teksts pēc oriģinālās vietnes: pielāgotas ēdienkartes, izbraukuma ēdināšana
  const banketiText = [
    { id: "edienkartes", title: t("banketi.menus.title"), text: t("banketi.menus.text") },
    { id: "izbraukums", title: t("banketi.away.title"), text: t("banketi.away.text") },
  ];
  // Banketu galerijas — tās, kuru lapa adminā ir "Banketi", admin secībā
  const galleries = Object.entries(site.galleries)
    .filter(([, g]) => g.page === "banketi" && g.images.length > 0)
    .map(([key, g]) => ({ key, ...g }));

  return (
    <div className={ui.page} data-cluster={line.cluster}>
      <div className={ui.shell}>
        <Masthead line={line} />

        {/* teksts pēc oriģinālās vietnes: pielāgotas ēdienkartes, izbraukuma ēdināšana */}
        {banketiText.map((block, i) => (
          <section key={block.id} className={ui.section} aria-labelledby={`banketi-${block.id}`}>
            <div className={ui.sectionHead}>
              <h2 className={ui.heading} id={`banketi-${block.id}`}>
                {block.title}
              </h2>
            </div>

            {i === 1 ? (
              <div className={styles.about}>
                <div className={ui.prose}>
                  <Paragraphs text={block.text} />
                </div>
                <div>
                  <h3 className={ui.sub}>{t("banketi.where.heading")}</h3>
                  <ul className={ui.rows}>
                    {venues.map((v) => (
                      <li key={v.id} className={ui.row}>
                        {v.href ? (
                          <a className={ui.rowLabel} href={v.href} target="_blank" rel="noreferrer">
                            {v.name} ↗
                          </a>
                        ) : (
                          <Link className={ui.rowLabel} to={v.path}>
                            {v.name}
                          </Link>
                        )}
                        <i className={ui.leader} aria-hidden="true" />
                        <span className={ui.rowValue}>līdz {v.capacity}</span>
                      </li>
                    ))}
                    <li className={ui.row}>
                      <span className={ui.rowLabel}>{t("banketi.where.outside")}</span>
                      <i className={ui.leader} aria-hidden="true" />
                      <span className={`${ui.rowValue} ${ui.rowMuted}`}>{t("banketi.where.outside_value")}</span>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className={ui.prose}>
                <Paragraphs text={block.text} />
              </div>
            )}
          </section>
        ))}

        {galleries.length > 0 && (
        <section className={ui.section} aria-labelledby="banketi-galerija">
          <div className={ui.sectionHead}>
            <h2 className={ui.heading} id="banketi-galerija">
              {t("banketi.gallery.heading")}
            </h2>
          </div>
          <ul className={styles.grid}>
            {galleries.map((item) => (
              <li key={item.key} className={styles.block}>
                <h3 className={`${ui.sub} ${styles.blockName}`}>
                  {item.title} <em>({item.images.length})</em>
                </h3>
                <Gallery images={item.images} alt={item.title} featured={4} columns={2} />
              </li>
            ))}
          </ul>
        </section>
        )}

        {ENQUIRY_FORM_ENABLED ? (
          <section className={`${ui.section} ${styles.enquiry}`} id="pieteikums" aria-labelledby="banketi-pieteikums">
            <div className={ui.sectionHead}>
              <h2 className={ui.heading} id="banketi-pieteikums">
                jūsu pasākums
              </h2>
              <p className={ui.facts}>
                <a href={telHref(line.phone)} onClick={() => track("zvans", { vieta: "banketi" })}>
                  {line.phone}
                </a>
                <a href={`mailto:${line.email}`}>{line.email}</a>
              </p>
            </div>
            <div className={styles.enquiryGrid}>
              <div className={ui.prose}>
                <p>
                  Aizpildiet pieteikumu vai zvaniet — pietiek ar datumu, viesu skaitu un pasākuma veidu, lai
                  mēs varētu sagatavot pirmo piedāvājumu.
                </p>
                <p>Jo agrāk sazināties, jo vairāk iespēju — īpaši kāzām un lieliem pasākumiem sezonā.</p>
              </div>
              <EnquiryForm line={line} />
            </div>
          </section>
        ) : (
          <div className={ui.cta} id="pieteikums">
            <div>
              <h2 className={ui.ctaTitle}>{t("banketi.cta.title")}</h2>
              <p className={ui.ctaText}>{t("banketi.cta.text")}</p>
              <p className={ui.facts}>
                <a href={telHref(line.phone)} onClick={() => track("zvans", { vieta: "banketi" })}>
                  {line.phone}
                </a>
                <a href={`mailto:${line.email}`}>{line.email}</a>
              </p>
            </div>
            <Link className={ui.btn} to="/kontakti">
              {t("banketi.cta.button")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
