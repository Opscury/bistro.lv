import { Link } from "react-router-dom";
import Img from "../components/Img.jsx";
import { lines, venues } from "../data/lines.js";
import { homeTitle, aboutText } from "../data/site.js";
import { ABOUT_ENABLED } from "../lib/features.js";
import ui from "../styles/Page.module.css";
import styles from "./Home.module.css";

/**
 * Viena līnija: foto, nosaukums ar punktu līniju un apraksts. Adreses
 * un darba laiki ir kājenē. Visa šūna ir viena saite; tās nosaukums
 * ekrānlasītājam ir tikai virsraksts.
 */
function LineCard({ line, index }) {
  const headingId = `home-${line.id}`;

  return (
    <li className={styles.entry} data-cluster={line.cluster}>
      <Link className={styles.link} to={line.path} aria-labelledby={headingId}>
        <div className={ui.frame}>
          <Img
            className={ui.photo}
            name={line.photo}
            alt={line.alt}
            sizes="(min-width: 700px) 494px, 100vw"
            loading={index < 2 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
          />
        </div>

        <div className={ui.nameRow}>
          <h2 className={`${ui.name} ${styles.name}`} id={headingId}>
            {line.name}
          </h2>
          <i className={ui.leader} aria-hidden="true" />
          <span className={`${ui.arrow} ${styles.arrow}`} aria-hidden="true">
            →
          </span>
        </div>

        <p className={ui.cardText}>{line.desc}</p>
      </Link>
    </li>
  );
}

function VenueCard({ venue }) {
  const headingId = `venue-${venue.id}`;
  const external = Boolean(venue.href);
  const inner = (
    <>
      <div className={ui.frame}>
        <Img
          className={ui.photo}
          name={venue.photo}
          alt={venue.alt}
          sizes="(min-width: 700px) 320px, 100vw"
        />
      </div>
      <div className={ui.nameRow}>
        <h3 className={ui.name} id={headingId}>
          {venue.name}
        </h3>
        <i className={ui.leader} aria-hidden="true" />
        <span className={ui.arrow} aria-hidden="true">
          {external ? `${venue.site} ↗` : "→"}
        </span>
      </div>
      <p className={ui.cardMeta}>
        līdz {venue.capacity} {venue.capacity >= 50 ? "cilvēkiem" : "personām"} · {venue.where}
      </p>
      {external && <span className="visually-hidden">Atver {venue.site} jaunā logā.</span>}
    </>
  );
  return (
    <li>
      {external ? (
        <a className={ui.card} href={venue.href} target="_blank" rel="noreferrer" aria-labelledby={headingId}>
          {inner}
        </a>
      ) : (
        <Link className={ui.card} to={venue.path} aria-labelledby={headingId}>
          {inner}
        </Link>
      )}
    </li>
  );
}

export default function Home() {
  return (
    <div className={ui.page}>
      <div className={ui.shell}>
        {/* virsraksts tikai ekrānlasītājam — lapa sākas ar četrām vietām */}
        <h1 className="visually-hidden">Silva, Jelgava: {homeTitle}</h1>

        {/* četras līnijas: bistro + konditoreja (Silvas ikdiena), tējas namiņš, banketi */}
        <ul className={styles.grid} aria-label="Silvas vietas">
          {lines.map((line, i) => (
            <LineCard key={line.id} line={line} index={i} />
          ))}
        </ul>

        {ABOUT_ENABLED && (
        <section className={ui.section} aria-labelledby="par-silvu">
          <div className={ui.sectionHead}>
            <h2 className={ui.heading} id="par-silvu">
              par silvu
            </h2>
            <p className={ui.facts}>
              <span>ģimenes uzņēmums</span>
              <span>viena virtuve</span>
              <span>četras vietas</span>
            </p>
          </div>
          <div className={ui.prose}>
            {aboutText.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>
        )}

        <section className={ui.section} aria-labelledby="vietas">
          <div className={ui.sectionHead}>
            <h2 className={ui.heading} id="vietas">
              vietas pasākumiem
            </h2>
          </div>
          <ul className={styles.venues}>
            {venues.map((v) => (
              <VenueCard key={v.id} venue={v} />
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
