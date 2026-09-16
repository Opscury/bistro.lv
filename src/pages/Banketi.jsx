import { Link } from "react-router-dom";
import EnquiryForm from "../components/EnquiryForm.jsx";
import Gallery from "../components/Gallery.jsx";
import Masthead from "../components/Masthead.jsx";
import { lineById, venues, telHref } from "../data/lines.js";
import { banketiEvents, banketiGalleries, banketiSteps, banketiVenueNote, galleries } from "../data/site.js";
import { track } from "../lib/analytics.js";
import { ENQUIRY_FORM_ENABLED } from "../lib/features.js";
import ui from "../styles/Page.module.css";
import styles from "./Banketi.module.css";

export default function Banketi() {
  const line = lineById.banketi;

  return (
    <div className={ui.page} data-cluster={line.cluster}>
      <div className={ui.shell}>
        <Masthead
          line={line}
          lead="Individuāli sastādīta ēdienkarte jūsu pasākumam — pie mums vai tur, kur svinat jūs."
        />

        <section className={ui.section} aria-labelledby="banketi-ka">
          <div className={ui.sectionHead}>
            <h2 className={ui.heading} id="banketi-ka">
              kā tas notiek
            </h2>
            <p className={ui.facts}>
              <a href="#pieteikums">pieteikums ↓</a>
            </p>
          </div>
          <ol className={ui.steps}>
            {banketiSteps.map((s) => (
              <li key={s.title} className={ui.step}>
                <h3 className={ui.stepTitle}>{s.title}</h3>
                <p className={ui.stepText}>{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={ui.section} aria-labelledby="banketi-kam">
          <div className={styles.about}>
            <div>
              <h2 className={ui.sub} id="banketi-kam">
                pasākumi
              </h2>
              <ul className={`${ui.list} ${styles.events}`}>
                {banketiEvents.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className={ui.sub}>kur</h2>
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
                  <span className={ui.rowLabel}>izbraukumā — pilī, meža būdiņā, uz ūdens</span>
                  <i className={ui.leader} aria-hidden="true" />
                  <span className={`${ui.rowValue} ${ui.rowMuted}`}>pēc vienošanās</span>
                </li>
              </ul>
              <p className={`${ui.prose} ${styles.venueNote}`}>{banketiVenueNote}</p>
            </div>
          </div>
        </section>

        <section className={ui.section} aria-labelledby="banketi-galerija">
          <div className={ui.sectionHead}>
            <h2 className={ui.heading} id="banketi-galerija">
              galerija
            </h2>
          </div>
          <ul className={styles.grid}>
            {banketiGalleries.map((item) => (
              <li key={item.key} className={styles.block}>
                <h3 className={`${ui.sub} ${styles.blockName}`}>
                  {item.title} <em>({galleries[item.key].length})</em>
                </h3>
                <Gallery images={galleries[item.key]} alt={item.title} featured={4} columns={2} />
              </li>
            ))}
          </ul>
        </section>

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
              <h2 className={ui.ctaTitle}>jūsu pasākums</h2>
              <p className={ui.ctaText}>Sazinieties ar mums, lai sastādītu Jums piemērotu ēdienkarti.</p>
              <p className={ui.facts}>
                <a href={telHref(line.phone)} onClick={() => track("zvans", { vieta: "banketi" })}>
                  {line.phone}
                </a>
                <a href={`mailto:${line.email}`}>{line.email}</a>
              </p>
            </div>
            <Link className={ui.btn} to="/kontakti">
              Kontaktēties
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
