import { useEffect, useRef, useState } from "react";
import ui from "../../styles/Page.module.css";

/**
 * Kategoriju josla zem galvenes. Lapas augšā tās nav — tur ir satura
 * rādītājs; tā parādās, kad pirmā kategorija aizritinājusies zem
 * galvenes, un tad stāv fiksēti, kamēr ritina piedāvājumu. Pašreizējā
 * sadaļa iezīmēta; čipi ritinās kā karuselis (bez gala). Joslas
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

  // Karuselis: saraksts ir trīs reizes pēc kārtas, un josla stāv vidējā
  // kopijā. Tāpēc pa kreisi no pirmā čipa redzams saraksta gals, un ritinot
  // tas nekur nebeidzas — kad apstājas tuvu malai, josla nemanāmi pārlec par
  // vienu kopiju atpakaļ uz vidu (saturs tur ir tieši tāds pats).
  // Ja viss saraksts ietilpst joslā, karuseļa nav — čipi vienkārši vidū.
  const setW = useRef(0);
  const placed = useRef(false);
  const [loop, setLoop] = useState(false);

  const measure = () => {
    const list = listRef.current;
    if (!list) return;
    const mid = list.querySelectorAll('[data-copy="1"]');
    if (!mid.length) return;
    const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
    const first = mid[0];
    const last = mid[mid.length - 1];
    setW.current = last.offsetLeft + last.offsetWidth - first.offsetLeft + gap;
    setLoop(setW.current > list.clientWidth + 1);
  };

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    // fonti var ielādēties vēlāk un mainīt čipu platumu
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  // pēc ritināšanas atgriežas vidējā kopijā (redzamais nemainās)
  useEffect(() => {
    const list = listRef.current;
    if (!list || !loop) return;
    let timer = 0;
    const recenter = () => {
      const w = setW.current;
      if (!w) return;
      if (list.scrollLeft < w * 0.5) list.scrollLeft += w;
      else if (list.scrollLeft > w * 1.5) list.scrollLeft -= w;
    };
    const onScroll = () => {
      const max = list.scrollWidth - list.clientWidth;
      // ar pirkstu aizmests līdz pašai malai — pārlec uzreiz, lai nav "sienas"
      if (list.scrollLeft <= 1 || list.scrollLeft >= max - 1) recenter();
      clearTimeout(timer);
      timer = setTimeout(recenter, 160);
    };
    list.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      list.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, [loop]);

  // aktīvais čips — joslas vidū; karuselī izvēlas tuvāko no trim kopijām
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    if (!loop) {
      placed.current = false;
      return;
    }
    const centerOf = (chip) =>
      chip.getBoundingClientRect().left -
      list.getBoundingClientRect().left +
      list.scrollLeft -
      (list.clientWidth - chip.offsetWidth) / 2;
    const chips = [...list.querySelectorAll(`[data-id="${active}"]`)];
    if (!chips.length) return;
    let left;
    if (!placed.current) {
      left = centerOf(chips.find((c) => c.dataset.copy === "1") || chips[0]);
    } else {
      const options = chips.map(centerOf);
      left = options.reduce((a, b) =>
        Math.abs(b - list.scrollLeft) < Math.abs(a - list.scrollLeft) ? b : a
      );
    }
    // kamēr josla vēl nav parādījusies, novieto bez animācijas
    list.scrollTo({ left, behavior: visible && placed.current ? "smooth" : "auto" });
    placed.current = true;
  }, [active, visible, loop]);

  return (
    <div
      className={visible ? `${ui.chipBar} ${ui.chipBarVisible}` : ui.chipBar}
      ref={barRef}
      aria-hidden={!visible}
    >
      <div className={ui.chipShell}>
        <ul
          className={loop ? `${ui.chips} ${ui.chipsLoop}` : `${ui.chips} ${ui.chipsFit}`}
          ref={listRef}
          aria-label="Piedāvājuma sadaļas"
        >
          {[0, 1, 2].map((copy) =>
            categories.map((c) => {
              // ekrāna lasītājiem un tastatūrai — tikai vidējā kopija
              const extra = copy !== 1;
              return (
                <li key={`${copy}-${c.id}`} aria-hidden={extra || undefined} data-extra={extra || undefined}>
                  <a
                    href={`#${c.id}`}
                    data-id={c.id}
                    data-copy={copy}
                    className={c.id === active ? `${ui.chip} ${ui.chipActive}` : ui.chip}
                    aria-current={!extra && c.id === active ? "true" : undefined}
                    tabIndex={visible && !extra ? undefined : -1}
                  >
                    {c.title}
                  </a>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
