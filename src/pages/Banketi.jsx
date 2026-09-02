import { Link } from "react-router-dom";
import Slideshow from "../components/Slideshow.jsx";
import { galleries } from "../data/site.js";
import styles from "./Banketi.module.css";

const sections = [
  { key: "jubilejas", label: "poga_jubilejas-2", alt: "Jubilejas" },
  { key: "kazas", label: "poga_kazas-2", alt: "Kāzas" },
  { key: "korporativie", label: "poga_korporativie_pasakumi", alt: "Korporatīvie pasākumi" },
  { key: "kafijasPauzes", label: "poga_kafijas_pauzes", alt: "Kafijas pauzes" },
  { key: "brokastis", label: "poga_brokastis-3", alt: "Brokastis" },
  { key: "atvaduMielasts", label: "poga_atvadu_mielasts-2", alt: "Atvadu mielasts" },
  { key: "salsmaize", label: "poga_salsmaize-2", alt: "Sālsmaize" },
];

function GalleryBlock({ item }) {
  return (
    <div className={styles.block}>
      <Slideshow images={galleries[item.key]} alt={item.alt} />
      <img
        className={styles.label}
        src={`/img/${item.label}.webp`}
        alt={item.alt}
        loading="lazy"
      />
    </div>
  );
}

export default function Banketi() {
  return (
    <div className={styles.page}>
      <h1 className="page-title">BANKETI</h1>

      <div className="panel">
        <p className={styles.lead}>Pielāgotas ēdienkartes</p>
        <p>
          Mēs piedāvājam individuāli pielāgotas ēdienkartes visdažādākajiem
          pasākumiem – kāzām, bildināšanām, kristībām, jubilejām, bēru
          mielastiem, kā arī korporatīvajiem pasākumiem, semināriem, konferenču
          kafijas pauzēm, prezentācijām un citiem nozīmīgiem dzīves notikumiem.
        </p>
        <p>
          Piedāvājumā ir plates, uzkodas, pamatēdieni, salāti, zupas, karstās
          uzkodas, dzērieni un pašu gatavoti konditorejas izstrādājumi. Pēc
          iepriekšējas vienošanās varam nodrošināt arī pasūtījumu piegādi.
          Neatkarīgi no pasākuma veida, mēs parūpēsimies, lai jūsu svinības būtu
          īpašas.
        </p>
        <p className={styles.lead}>Izbraukuma ēdināšana</p>
        <p>
          Mūsu pakalpojumi pieejami gan Bistro “Silva” telpās Jelgavas centrā,
          pontonā vai uz peldterases, gan jebkurā citā jums vēlamā vietā – pilī,
          meža būdiņā, uz ūdens vai citur.
        </p>
        <p>
          Mēs strādājam ar tuvākiem un tālākiem galamērķiem, nodrošinot skaisti
          noformētus galdus, atbilstošas dekorācijas un profesionālu
          apkalpošanu, kas padarīs jūsu pasākumu neaizmirstamu. Mūsu komanda
          parūpēsies, lai jūs pilnībā izbaudītu savu īpašo notikumu.
        </p>
      </div>

      <div className={styles.cta}>
        <Link className="btn" to="/kontakti">
          Kontaktēties
        </Link>
      </div>

      <div className={styles.grid}>
        {sections.map((item) => (
          <GalleryBlock key={item.key} item={item} />
        ))}
      </div>
    </div>
  );
}
