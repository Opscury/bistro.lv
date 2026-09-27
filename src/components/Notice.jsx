import { Link } from "react-router-dom";
import Img from "./Img.jsx";
import styles from "./Notice.module.css";

/**
 * Aktualitātes rāmis — vieta, kur karājas tas, kas šobrīd notiek:
 * sezonas piedāvājums, jaunums, plakāts. Rāmis pats ir kluss (balts
 * papīrs, mata līnija, viena zaļa svītra augšā); skaļš ir saturs, ko
 * tajā ieliek. Tas pats rāmis derēs arī citām lapām.
 *
 * label — mazā etiķete augšā pa kreisi ("aktuāli", "jaunums")
 * meta  — mazais teksts pa labi: sezona, datumi, "līdz 30.09."
 * photo — plakāts no public/img (tikai faila nosaukums)
 * alt   — kas uz plakāta rakstīts
 * title, text, link — neobligāti; ja plakāts pats visu pasaka, izlaid
 */
export default function Notice({ label, meta, photo, alt, title, text, link, sizes }) {
  if (!photo && !title && !text) return null;

  return (
    <figure className={styles.notice}>
      <figcaption className={styles.head}>
        <span className={styles.label}>{label}</span>
        {meta && <span className={styles.meta}>{meta}</span>}
      </figcaption>

      {photo && (
        <div className={styles.frame}>
          <Img
            className={styles.poster}
            name={photo}
            alt={alt}
            sizes={sizes || "(min-width: 700px) 460px, 100vw"}
          />
        </div>
      )}

      {(title || text || link) && (
        <div className={styles.foot}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {text && <p className={styles.text}>{text}</p>}
          {link &&
            (link.to ? (
              <Link className={styles.link} to={link.to}>
                {link.label} <span aria-hidden="true">→</span>
              </Link>
            ) : (
              <a className={styles.link} href={link.href} target="_blank" rel="noreferrer">
                {link.label} <span aria-hidden="true">↗</span>
              </a>
            ))}
        </div>
      )}
    </figure>
  );
}
