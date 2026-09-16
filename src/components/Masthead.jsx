import ui from "../styles/Page.module.css";

/**
 * Lapas masthead: viens vārds mazajiem burtiem un ievads. Adreses,
 * darba laiki un tālruņi ir kājenē un Kontaktos, nevis šeit. Līniju
 * klasteru zīme ("Silva · kopš 1994" virs atbalstīto līniju nosaukuma)
 * pagaidām izslēgta — lēmums pēc 2. viļņa; data-cluster uz lapas paliek.
 */
export default function Masthead({ line, title, lead, children, rule = false }) {
  // tikai nosaukums, bez ievada — bez līnijas apakšā, lai nav divas
  // biezas līnijas viena virs otras ar tukšumu pa vidu
  // `rule` atstāj līniju arī bez ievada (konditorejā zem tās ir rādītājs)
  const bare = !lead && !children && !rule;
  return (
    <header className={bare ? `${ui.mast} ${ui.mastBare}` : ui.mast}>
      <h1 className={ui.title}>{title ?? line?.name}</h1>
      {lead && <p className={ui.lead}>{lead}</p>}
      {children}
    </header>
  );
}
