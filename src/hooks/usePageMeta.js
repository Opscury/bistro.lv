import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { metaFor, SITE_URL } from "../data/meta.js";

function setMeta(selector, attr, value) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(selector.startsWith("link") ? "link" : "meta");
    const [, key, val] = selector.match(/\[(\w+(?::\w+)?)="([^"]+)"\]/) || [];
    if (key) el.setAttribute(key, val);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

/**
 * Pārlūkā, mainot lapu, atjauno <title>, aprakstu, kanonisko saiti un
 * og: tagus. Statiskajā HTML tos pašus ieliek scripts/prerender.mjs,
 * tāpēc pirmajā ielādē nekas nemainās.
 */
export default function usePageMeta() {
  const { pathname } = useLocation();
  useEffect(() => {
    const m = metaFor(pathname);
    document.title = m.title;
    setMeta('meta[name="description"]', "content", m.description);
    setMeta('link[rel="canonical"]', "href", `${SITE_URL}${pathname === "/" ? "/" : pathname}`);
    setMeta('meta[property="og:title"]', "content", m.title);
    setMeta('meta[property="og:description"]', "content", m.description);
    setMeta('meta[property="og:url"]', "content", `${SITE_URL}${pathname}`);
    setMeta('meta[property="og:image"]', "content", `${SITE_URL}${m.og}`);
    setMeta('meta[name="robots"]', "content", m.noindex ? "noindex" : "index,follow");
  }, [pathname]);
}
