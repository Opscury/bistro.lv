import { Link } from "react-router-dom";
import Img from "../components/Img.jsx";
import Masthead from "../components/Masthead.jsx";
import Notice from "../components/Notice.jsx";
import WeeklyMenu from "../components/WeeklyMenu.jsx";
import menu from "../data/menu.json";
import { lineById, useSite, useTexts } from "../lib/content.jsx";
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
          <Img className={ui.photo} image={item.image} name={item.photo} alt={item.alt || ""} sizes="(min-width: 900px) 320px, (min-width: 600px) 50vw, 100vw" />
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
        <p className={ui.cardMeta}>{item.time || " "}</p>
        <span className="visually-hidden"> (PDF, atveras jaunā logā)</span>
      </a>
    </li>
  );
}

/**
 * Aktualitāte bistro lapā: jaunākā aktīvā no admin, vai — ja tādas nav —
 * Instagram rāmis (tas, kas tur bija vienmēr), lai blakus grupu
 * ēdināšanai nepaliek tukša vieta.
 */
function BistroNotice() {
  const site = useSite();
  const t = useTexts();
  const promo = site.notices?.bistro;
  if (promo) return <Notice {...promo} />;
  return (
    <Notice
      label={t("bistro.instagram.label")}
      meta={site.company.instagramHandle}
      text={t("bistro.instagram.text")}
      link={{ href: site.company.instagram, label: t("bistro.instagram.link") }}
    />
  );
}

export default function Bistro() {
  const site = useSite();
  const t = useTexts();
  const line = lineById(site, "bistro");
  // Ēdienkaršu kartītes: nosaukums, laiks un bilde no admin; PDF — /menu/*.pdf
  const card = (kind) => {
    const photo = site.photos[`bistro.menu.${kind}`];
    return {
      ...menu[kind],
      title: t(`bistro.menu.${kind}.title`) || menu[kind].title,
      time: t(`bistro.menu.${kind}.time`),
      image: photo,
      alt: photo?.alt,
    };
  };
  const lunch = { ...menu.lunch, ...card("lunch") };
  const groupsPhoto = site.photos["bistro.groups"];
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
                {t("bistro.menus.heading")}
              </h2>
            </div>
            <ul className={styles.menus}>
              <MenuCard item={lunch} id="pusdienas" />
              <MenuCard item={card("breakfast")} id="brokastis" />
              <MenuCard item={card("drinks")} id="dzerieni" />
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
              <MenuCard item={card("breakfast")} id="brokastis" />
              <MenuCard item={card("drinks")} id="dzerieni" />
            </ul>
          </section>
        )}

        <section className={ui.section} aria-labelledby="bistro-grupas">
          <div className={styles.more}>
            <div className={styles.groups}>
              <div className={ui.frame}>
                <Img
                  className={ui.photo}
                  image={groupsPhoto}
                  sizes="(min-width: 600px) 45vw, 100vw"
                />
              </div>
              <div className={ui.nameRow}>
                <h2 className={ui.name} id="bistro-grupas">
                  {t("bistro.groups.title")}
                </h2>
              </div>
              <p className={ui.cardMeta}>{t("bistro.groups.note")}</p>
              <p className={ui.cardText}>{t("bistro.groups.text")}</p>
              <div className={`${ui.actions} ${styles.groupsActions}`}>
                <Link className={`${ui.btn} ${ui.btnGhost}`} to="/kontakti#forma">
                  {t("bistro.groups.button")}
                </Link>
              </div>
            </div>

            <BistroNotice />
          </div>
        </section>
      </div>
    </div>
  );
}
