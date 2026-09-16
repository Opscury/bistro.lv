import ui from "../styles/Page.module.css";

/**
 * Lapas masthead: viens vārds mazajiem burtiem un ievads. Adreses,
 * darba laiki un tālruņi ir kājenē un Kontaktos, nevis šeit. Līniju
 * klasteru zīme ("Silva · kopš 1994" virs atbalstīto līniju nosaukuma)
 * pagaidām izslēgta — lēmums pēc 2. viļņa; data-cluster uz lapas paliek.
 */
export default function Masthead({ line, title, lead, children }) {
  return (
    <header className={ui.mast}>
      <h1 className={ui.title}>{title ?? line?.name}</h1>
      {lead && <p className={ui.lead}>{lead}</p>}
      {children}
    </header>
  );
}
