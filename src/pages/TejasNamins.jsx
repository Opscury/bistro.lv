import { galleries } from "../data/site.js";
import styles from "./TejasNamins.module.css";

export default function TejasNamins() {
  return (
    <div className={styles.page}>
      <h1 className="page-title">TĒJAS NAMIŅŠ</h1>

      <div className={styles.intro}>
        <div className={styles.textCol}>
          <div className="panel">
            <p>
              Omulīgs Tējas namiņš, kas atrodas Pilssalas ielā 2A starp Lielupi
              un Driksu, kur baudīt dažādas tējas, kafiju, saldējumu, gardas
              kūkas un smalkmaizītes. Ir neliels, bet pārdomāts karsto ēdienu
              piedāvājums.
            </p>
            <p>
              No namiņa paveras skaists skats uz pilsētu, upi un upes
              strūklakām. Visu gadu ir iespēja baudīt dzērienus un ēdienus pie
              āra galdiņiem.
            </p>
          </div>
          <img
            className={styles.wideShot}
            src="/img/tejas_namins_1_1-6.webp"
            alt="Tējas namiņš"
            loading="lazy"
          />
        </div>

        <div className={styles.imageCol}>
          <img
            src="/img/Saldejuma-kokteili.webp"
            alt="Saldējuma kokteiļi"
            loading="lazy"
          />
        </div>
      </div>

      <div className={styles.gallery}>
        {galleries.tejasNamins.map((src, i) => (
          <img
            key={src}
            src={`/img/${src}`}
            alt={`Tējas namiņš ${i + 1}`}
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
}
