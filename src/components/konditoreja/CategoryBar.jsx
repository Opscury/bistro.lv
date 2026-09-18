import { useEffect, useRef, useState } from "react";
import ui from "../../styles/Page.module.css";

/**
 * Kategoriju josla zem galvenes. Lapas augšā tās nav — tur ir satura
 * rādītājs; tā parādās, kad pirmā kategorija aizritinājusies zem
 * galvenes, un tad stāv fiksēti, kamēr ritina piedāvājumu. Pašreizējā
 * sadaļa iezīmēta; uz telefona čipi ritinās horizontāli. Joslas
 * augstumu ieliek --sticky-extra, lai enkuri apstājas zem tās.
 */
export default function CategoryBar({ categories }) {
  const [active, setActive] = useState(categories[0]?.id);
  const [visible, setVisible] = useState(false);
  const barRef = useRef(null);
  const listRef = useRef(null);

  // augstums -> --sticky-extra (enkuru atkāpei), arī kamēr josla paslēpta
  useEffect(() => {
    const el = barRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const root = document.documentElement;
    const set = () => root.style.setProperty("--sticky-extra", `${el.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.setProperty("--sticky-extra", "0px");
    };
  }, []);

  // vai josla redzama un kura sadaļa ir zem tās
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const headerH =
        parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 74;
      const barH = barRef.current?.offsetHeight || 0;
      const line = headerH + barH + 24;
      const first = document.getElementById(categories[0]?.id);
      setVisible(Boolean(first) && first.getBoundingClientRect().top <= line);
      let current = categories[0]?.id;
      for (const c of categories) {
        const el = document.getElementById(c.id);
        if (el && el.getBoundingClientRect().top <= line) current = c.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [categories]);

  // aktīvo čipu vienmēr turēt tieši joslas vidū
  useEffect(() => {
    const list = listRef.current;
    const chip = list?.querySelector(`[data-id="${active}"]`);
    if (!list || !chip) return;
    const chipLeft =
      chip.getBoundingClientRect().left - list.getBoundingClientRect().left + list.scrollLeft;
    const target = chipLeft - (list.clientWidth - chip.offsetWidth) / 2;
    const max = list.scrollWidth - list.clientWidth;
    const left = Math.min(Math.max(0, target), max);
    // kamēr josla vēl nav parādījusies, novieto bez animācijas
    list.scrollTo({ left, behavior: visible ? "smooth" : "auto" });
  }, [active, visible]);

  return (
    <div
      className={visible ? `${ui.chipBar} ${ui.chipBarVisible}` : ui.chipBar}
      ref={barRef}
      aria-hidden={!visible}
    >
      <div className={ui.chipShell}>
        <ul className={ui.chips} ref={listRef} aria-label="Piedāvājuma sadaļas">
          {categories.map((c) => (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                data-id={c.id}
                className={c.id === active ? `${ui.chip} ${ui.chipActive}` : ui.chip}
                aria-current={c.id === active ? "true" : undefined}
                tabIndex={visible ? undefined : -1}
              >
                {c.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
