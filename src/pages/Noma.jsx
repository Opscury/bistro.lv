import { Link } from "react-router-dom";
import Gallery from "../components/Gallery.jsx";
import Img from "../components/Img.jsx";
import PriceRows from "../components/PriceRows.jsx";
import Slideshow from "../components/Slideshow.jsx";
import { venues } from "../data/lines.js";
import { galleries } from "../data/site.js";
import ui from "../styles/Page.module.css";
import styles from "./Noma.module.css";

// Zāles īres cenas — nosaukums ........ cena
const prices = [
  {
    title: "Mazā zāle",
    note: null,
    rows: [
      { name: "Ar ēdināšanu", price: "30 €/h" },
      { name: "Bez ēdināšanas", size: "no 3 stundām", price: "40 €/h" },
      { name: "Bez ēdināšanas", size: "1–2 stundas", price: "50 €/h" },
    ],
  },
  {
    title: "Lielā zāle",
    note: "ietver arī mazo zāli",
    rows: [
      { name: "Ar ēdināšanu", price: "40 €/h" },
      { name: "Bez ēdināšanas", size: "no 3 stundām", price: "45 €/h" },
      { name: "Bez ēdināšanas", size: "1–2 stundas", price: "60 €/h" },
    ],
  },
];

/** Pontons un peldterase — viens un tas pats bloks. */
function Venue({ venue, gallery, children }) {
  const id = `noma-${venue.id}`;
  return (
    <section className={ui.section} aria-labelledby={id}>
      <div className={ui.sectionHead}>
        <h2 className={ui.heading} id={id}>
          {venue.name}
        </h2>
        <p className={ui.facts}>
          <span>līdz {venue.capacity} personām</span>
          <a href={venue.href} target="_blank" rel="noreferrer">
            {venue.site} ↗
          </a>
        </p>
      </div>

      <div className={`${ui.prose} ${styles.venueText}`}>{children}</div>

      <div className={styles.venuePhotos}>
        <Img
          className={styles.venueMain}
          name={venue.photo}
          alt={venue.alt}
          sizes="(min-width: 700px) 494px, 100vw"
        />
        <Gallery images={gallery} alt={venue.name} featured={4} columns={2} />
      </div>

      <div className={`${ui.actions} ${styles.venueActions}`}>
        <a className={`${ui.btn} ${ui.btnGhost}`} href={venue.href} target="_blank" rel="noreferrer">
          Uzzināt vairāk ↗
        </a>
        <Link className={ui.btn} to="/kontakti">
          Pieteikt pasākumu
        </Link>
      </div>
    </section>
  );
}

export default function Noma() {
  const [zale, pontons, peldterase] = venues;

  return (
    <div className={ui.page} data-cluster="banketi">
      <div className={ui.shell}>
        <header className={`${ui.mast} ${ui.mastBare}`}>
          <h1 className={ui.title}>telpu noma</h1>
        </header>

        {/* ---------------- Zāle ---------------- */}
        <section className={ui.section} aria-labelledby="noma-zale">
          <div className={ui.sectionHead}>
            <h2 className={ui.heading} id="noma-zale">
              {zale.title}
            </h2>
          </div>

          <div className={styles.hall}>
            <div className={ui.prose}>
              <p>
                Bistro Silva 2. stāvā atrodas viesību un semināru zāle, kas ar bīdāmo sienu viegli
                transformējama divās atsevišķās telpās. Tā ir piemērota semināriem, konferencēm, svinībām
                un neformāliem pasākumiem līdz 90 cilvēkiem.
              </p>
              <p>
                <strong>Zāle ir aprīkota ar visu nepieciešamo veiksmīgam pasākumam:</strong>
              </p>
              <ul className={ui.list}>
                <li>Tehniskais aprīkojums: ekrāns, apskaņošanas sistēma, WiFi, baltā tāfele.</li>
                <li>Papildu ērtības: garderobe, atsevišķas labierīcības vīriešiem un sievietēm, kondicionieris.</li>
              </ul>
              <p>
                Ērti vienu no telpām izmantot sapulču, semināru vai citu aktivitāšu norisei, bet otru –
                kafijas pauzēm, pusdienām.
              </p>
              <p>
                Mēs nodrošinām pilnu servisu un plašu ēdienkarti, kas ietver plates, uzkodas, pamatēdienus,
                salātus, zupas, dzērienus un pašu gatavotus konditorejas izstrādājumus. Katram pasākumam
                izstrādājam individuālu ēdienkarti, ņemot vērā jūsu vēlmes un īpašās vajadzības.
              </p>
            </div>

            <div className={styles.hallMedia}>
              <Slideshow images={galleries.banketuZale} alt="Banketu zāle" />
            </div>
          </div>
        </section>

        {/* ---------------- Cenas ---------------- */}
        <section className={ui.section} aria-labelledby="noma-cenas">
          <div className={ui.sectionHead}>
            <h2 className={ui.heading} id="noma-cenas">
              zāles īres cenas
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
            <Link className={ui.btn} to="/kontakti">
              Pieteikt pasākumu
            </Link>
          </div>
        </section>

        {/* ---------------- Pontons ---------------- */}
        <Venue venue={pontons} gallery={galleries.pontons}>
          <p>
            Pontons Silva, uz Driksas upes Jelgavas centrā, piedāvā gleznainu skatu uz Driksas promenādi
            un Trīsvienības baznīcas torni, netālu no koncertzāles “Mītava”. Piemērots pasākumiem līdz 30
            personām, Pontons piedāvā omulīgu saunu relaksācijai un plašu jumta terasi, kas pieejama
            labos laikapstākļos.
          </p>
          <p>
            Netālu atrodas pilsētas stāvlaukums, nodrošinot ērtu piekļuvi viesiem. Par gardām maltītēm un
            nevainojamu apkalpošanu rūpējas Silva ar savu profesionālo viesmīļu komandu.
          </p>
        </Venue>

        {/* ---------------- Peldterase ---------------- */}
        <Venue venue={peldterase} gallery={galleries.peldterase}>
          <p>
            Peldterase Driksas upē, blakus koncertzālei “Mītava”, ir ideāla vieta pasākumiem līdz 40
            personām. Pieejams arī stāvlaukums. Lielākiem pasākumiem peldterasi var apvienot ar Pontonu
            Silva, iegūstot vairāk vietas. Par gardiem ēdieniem un laipnu apkalpošanu gādā Silva,
            nodrošinot pilnvērtīgu svētku pieredzi.
          </p>
        </Venue>
      </div>
    </div>
  );
}
