import { useEffect, useRef } from "react";
import styles from "./Notice.module.css";

const VALID = /^https:\/\/www\.instagram\.com\/(p|reel|tv)\/[A-Za-z0-9_-]{5,40}\/$/;
const SCRIPT = "https://www.instagram.com/embed.js";

let loading;
function loadInstagram() {
  if (window.instgrm) return Promise.resolve(window.instgrm);
  loading ||= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.async = true;
    s.src = SCRIPT;
    s.onload = () => resolve(window.instgrm);
    s.onerror = () => {
      loading = undefined;
      reject(new Error("instagram embed.js"));
    };
    document.body.appendChild(s);
  });
  return loading;
}

/**
 * Instagram ieraksts. Prerender un bez JS — saite uz ierakstu. Kad rāmis
 * tuvojas ekrānam, ielādē Instagram embed.js, un tas saiti nomaina ar ierakstu.
 * Iekšējo HTML veido mēs paši no pārbaudītas adreses (nevis ielīmēto kodu),
 * un React to vairs neaiztiek — embed.js drīkst to pārbūvēt.
 */
export default function InstagramEmbed({ url, captioned }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let done = false;
    const run = () => {
      if (done) return;
      done = true;
      loadInstagram()
        .then((ig) => ig?.Embeds?.process())
        .catch(() => {}); // paliek saite — arī labi
    };
    if (!("IntersectionObserver" in window)) return run();
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          run();
        }
      },
      { rootMargin: "400px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [url]);

  if (!VALID.test(url)) return null;

  const html =
    `<blockquote class="instagram-media"${captioned ? " data-instgrm-captioned" : ""}` +
    ` data-instgrm-permalink="${url}" data-instgrm-version="14">` +
    `<a href="${url}" target="_blank" rel="noreferrer">Skatīt ierakstu Instagram ↗</a></blockquote>`;

  return (
    <div
      key={url}
      ref={ref}
      className={styles.instagram}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
