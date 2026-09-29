import { Link } from "react-router-dom";
import Img from "./Img.jsx";
import { Lines } from "./Paragraphs.jsx";
import styles from "./Notice.module.css";

/**
 * Aktualitātes rāmis — vieta, kur karājas tas, kas šobrīd notiek:
 * sezonas piedāvājums, jaunums, plakāts. Rāmis pats ir kluss (balts
 * papīrs, mata līnija, viena zaļa svītra augšā); skaļš ir saturs, ko
 * tajā ieliek. Saturu maina adminā: "Aktualitātes (plakāti)".
 *
 * label — mazā etiķete augšā pa kreisi ("aktuāli", "jaunums")
 * meta  — mazais teksts pa labi: sezona, datumi, "līdz 30.09."
 * image — plakāts no admin ({src, srcset, w, h, alt, name}); photo — fails no public/img
 * alt   — kas uz plakāta rakstīts
 * title, text, link — neobligāti; ja plakāts pats visu pasaka, izlaid
 */
export default function Notice({ label, meta, photo, image, alt, title, text, link, sizes }) {
  const poster = image || photo;
  if (!poster && !title && !text) return null;

  return (
    <figure className={styles.notice}>
      <figcaption className={styles.head}>
        <span className={styles.label}>{label}</span>
        {meta && <span className={styles.meta}>{meta}</span>}
      </figcaption>

      {poster && (
        <div className={styles.frame}>
          <Img
            className={styles.poster}
            image={image || undefined}
            name={image ? undefined : photo}
            alt={alt ?? ""}
            sizes={sizes || "(min-width: 700px) 460px, 100vw"}
          />
        </div>
      )}

      {(title || text || link) && (
        <div className={styles.foot}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {text && <p className={styles.text}><Lines text={text} /></p>}
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
