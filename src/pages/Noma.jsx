import Slideshow from "../components/Slideshow.jsx";
import { galleries } from "../data/site.js";
import styles from "./Noma.module.css";

export default function Noma() {
  return (
    <div className={styles.page}>
      {/* ---------------- Telpu noma ---------------- */}
      <h1 className="page-title">TELPU NOMA</h1>

      <div className="panel">
        <p>
          Bistro “Silva” 2. stāvā atrodas viesību un semināru zāle, kas ar
          bīdāmo sienu viegli transformējama divās atsevišķās telpās. Tā ir
          lieliski piemērota semināriem, konferencēm, svinībām un neformāliem
          pasākumiem līdz 90 cilvēkiem.
        </p>
        <p className={styles.bold}>
          Zāle ir aprīkota ar visu nepieciešamo veiksmīgam pasākumam:
        </p>
        <p>
          ◦ Tehniskais aprīkojums: ekrāns, apskaņošanas sistēma, WiFi, baltā
          tāfele.
        </p>
        <p>
          ◦ Papildu ērtības: garderobe, atsevišķas labierīcības vīriešiem un
          sievietēm, kondicionieris.
        </p>
        <p>
          Ērti vienu no telpām izmantot sapulču, semināru vai citu aktivitāšu
          norisei, bet otru – kafijas pauzēm, pusdienām.
        </p>
        <p>
          Mēs nodrošinām pilnu servisu un plašu ēdienkarti, kas ietver plates,
          uzkodas, pamatēdienus, salātus, zupas, dzērienus un pašu gatavotus
          konditorejas izstrādājumus. Katram pasākumam izstrādājam individuālu
          ēdienkarti, ņemot vērā jūsu vēlmes un īpašās vajadzības.
        </p>
      </div>

      <div className={styles.spacer20} />

      <div className={styles.split}>
        <div className="panel">
          <p className={styles.bold}>Zāles īres cenas Mazā zāle:</p>
          <p className={styles.tight}>◦ Ar ēdināšanu: 30 EUR/h</p>
          <p className={styles.tight}>◦ Bez ēdināšanas (no 3 stundām): 40 EUR/h</p>
          <p className={styles.tight}>◦ Bez ēdināšanas (1–2 stundas): 50 EUR/h</p>
          <p className={styles.bold}>Lielā zāle (ietver arī mazo zāli):</p>
          <p className={styles.tight}>◦ Ar ēdināšanu: 40 EUR/h</p>
          <p className={styles.tight}>◦ Bez ēdināšanas (no 3 stundām): 45 EUR/h</p>
          <p className={styles.tight}>◦ Bez ēdināšanas (1–2 stundas): 60 EUR/h</p>
        </div>
        <div className={styles.wideCol}>
          <Slideshow images={galleries.banketuZale} alt="Banketu zāle" />
        </div>
      </div>

      <hr className="rule" />

      {/* ---------------- Pontons ---------------- */}
      <section className={styles.section}>
        <h2 className="section-title">Pontons Silva</h2>

        <div className="panel">
          <p>
            Pontons Silva, uz Driksas upes Jelgavas centrā, piedāvā gleznainu
            skatu uz Driksas promenādi un Trīsvienības baznīcas torni, netālu no
            koncertzāles “Mītava”. Piemērots pasākumiem līdz 30 personām,
            Pontons piedāvā omulīgu saunu relaksācijai un plašu jumta terasi,
            kas pieejama labos laikapstākļos.
          </p>
          <p>
            Netālu atrodas pilsētas stāvlaukums, nodrošinot ērtu piekļuvi
            viesiem. Par gardām maltītēm un nevainojamu apkalpošanu rūpējas
            kafejnīca Silva ar savu profesionālo viesmīļu komandu.
          </p>
          <p>Pontons Silva ir lieliska izvēle jūsu īpašajiem pasākumiem!</p>
        </div>

        <div className={styles.splitNarrow}>
          <img src="/img/pontons_main.webp" alt="Pontons Silva" loading="lazy" />
          <Slideshow images={galleries.pontons} alt="Pontons" />
        </div>

        <div className={styles.center}>
          <a
            className="btn"
            href="https://www.pontons.lv/"
            target="_blank"
            rel="noreferrer"
          >
            Uzzināt vairāk
          </a>
        </div>
      </section>

      <hr className="rule" />

      {/* ---------------- Peldterase ---------------- */}
      <section className={styles.section}>
        <h2 className="section-title">Peldterase Jelgavā</h2>

        <div className="panel">
          <p>
            Peldterase Driksas upē, blakus koncertzālei “Mītava”, ir ideāla
            vieta pasākumiem līdz 40 personām. Pieejams arī stāvlaukums.
            Lielākiem pasākumiem peldterasi var apvienot ar Pontonu SILVA
            (Pontons.lv), iegūstot vairāk vietas. Nākamajā sezonā būs iespējams
            peldterasi pārvietot uz citām vietām Lielupes un Driksas krastos.
            Par gardiem ēdieniem un laipnu apkalpošanu gādās kafejnīca Silva,
            nodrošinot pilnvērtīgu svētku pieredzi.
          </p>
        </div>

        <div className={styles.splitNarrow}>
          <img
            src="/img/peldterase_main.webp"
            alt="Peldterase Jelgavā"
            loading="lazy"
          />
          <Slideshow images={galleries.peldterase} alt="Peldterase" />
        </div>

        <div className={styles.center}>
          <a
            className="btn"
            href="https://www.peldterase.lv/"
            target="_blank"
            rel="noreferrer"
          >
            Uzzināt vairāk
          </a>
        </div>
      </section>

      <hr className="rule" />
    </div>
  );
}
