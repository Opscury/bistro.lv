import { Link } from "react-router-dom";
import Img from "../components/Img.jsx";
import Masthead from "../components/Masthead.jsx";
import WeeklyMenu from "../components/WeeklyMenu.jsx";
import menu from "../data/menu.json";
import { company, lineById } from "../data/lines.js";
import { bistroGroups, bistroPoster } from "../data/site.js";
import { track } from "../lib/analytics.js";
import ui from "../styles/Page.module.css";
import styles from "./Bistro.module.css";

/** Ēdienkarte kā PDF: foto, nosaukums ar punktu līniju un "PDF ↗". */
function MenuCard({ item, id }) {
  const headingId = `menu-${id}`;
  return (
    <li>
      <a
        className={ui.card}
        href={item.pdf}
        target="_blank"
        rel="noreferrer"
        aria-labelledby={headingId}
        onClick={() => track("pdf", { fails: id })}
      >
        <div className={ui.frame}>
          <Img className={ui.photo} name={item.photo} alt="" sizes="(min-width: 900px) 320px, (min-width: 600px) 50vw, 100vw" />
        </div>
        <div className={ui.nameRow}>
          <h3 className={ui.name} id={headingId}>
            {item.title}
          </h3>
          <i className={ui.leader} aria-hidden="true" />
          <span className={ui.arrow} aria-hidden="true">
            PDF ↗
          </span>
        </div>
        <p className={ui.cardMeta}>{item.time ?? " "}</p>
        <span className="visually-hidden"> (PDF, atveras jaunā logā)</span>
      </a>
    </li>
  );
}

export default function Bistro() {
  const line = lineById.bistro;
  const lunch = menu.lunch;
  // menu.json -> lunch.showRows: true rāda nedēļas ēdienkarti lapā kā
  // rindas; pagaidām tikai PDF, kā oriģinālajā vietnē.
  const showRows = lunch.showRows && Array.isArray(lunch.sections) && lunch.sections.length > 0;

  return (
    <div className={ui.page} data-cluster={line.cluster}>
      <div className={ui.shell}>
        <Masthead line={line} />

        {showRows ? (
          <WeeklyMenu menu={lunch} />
        ) : (
          <section className={ui.section} aria-labelledby="bistro-menus">
            <div className={ui.sectionHead}>
              <h2 className={ui.heading} id="bistro-menus">
                ēdienkartes
              </h2>
            </div>
            <ul className={styles.menus}>
              <MenuCard item={lunch} id="pusdienas" />
              <MenuCard item={menu.breakfast} id="brokastis" />
              <MenuCard item={menu.drinks} id="dzerieni" />
            </ul>
          </section>
        )}

        {showRows && (
          <section className={ui.section} aria-labelledby="bistro-citas">
            <div className={ui.sectionHead}>
              <h2 className={ui.heading} id="bistro-citas">
                brokastis un dzērieni
              </h2>
            </div>
            <ul className={styles.menus}>
              <MenuCard item={menu.breakfast} id="brokastis" />
              <MenuCard item={menu.drinks} id="dzerieni" />
            </ul>
          </section>
        )}

        <section className={ui.section} aria-labelledby="bistro-grupas">
          <div className={styles.more}>
            <div className={styles.groups}>
              <div className={ui.frame}>
                <Img
                  className={ui.photo}
                  name={bistroGroups.photo}
                  alt={bistroGroups.alt}
                  sizes="(min-width: 600px) 45vw, 100vw"
                />
              </div>
              <div className={ui.nameRow}>
                <h2 className={ui.name} id="bistro-grupas">
                  {bistroGroups.title}
                </h2>
              </div>
              <p className={ui.cardMeta}>{bistroGroups.note}</p>
              <p className={ui.cardText}>{bistroGroups.text}</p>
              <div className={`${ui.actions} ${styles.groupsActions}`}>
                <Link className={`${ui.btn} ${ui.btnGhost}`} to="/kontakti">
                  Pieteikt grupu
                </Link>
              </div>
            </div>

            <Img
              className={styles.poster}
              name={bistroPoster.photo}
              alt={bistroPoster.alt}
              sizes="(min-width: 600px) 55vw, 100vw"
            />
          </div>
        </section>

        <div className={ui.cta}>
          <div>
            <h2 className={ui.ctaTitle}>aktualitātes</h2>
            <p className={ui.ctaText}>Jaunumi un nedēļas piedāvājums — mūsu Instagram lapā.</p>
          </div>
          <a className={ui.btn} href={company.instagram} target="_blank" rel="noreferrer">
            Instagram ↗
          </a>
        </div>
      </div>
    </div>
  );
}
