import { footerText } from "../data/site.js";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.text}>{footerText}</p>
    </footer>
  );
}
