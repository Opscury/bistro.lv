// Apmeklējumu uzskaite bez sīkdatnēm (Plausible). Ieslēdzas tikai tad,
// ja .env ir VITE_PLAUSIBLE_DOMAIN=bistro.lv — citādi nekas netiek
// ielādēts. Notikumi: PDF atvēršana, zvans, formas nosūtīšana.

const DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN || "";

export function initAnalytics() {
  if (!DOMAIN || typeof document === "undefined") return;
  if (document.querySelector("script[data-domain]")) return;
  const s = document.createElement("script");
  s.defer = true;
  s.dataset.domain = DOMAIN;
  s.src = "https://plausible.io/js/script.outbound-links.file-downloads.js";
  document.head.appendChild(s);
}

/** track("zvans", { vieta: "konditoreja" }) */
export function track(name, props) {
  if (typeof window === "undefined" || !window.plausible) return;
  window.plausible(name, props ? { props } : undefined);
}
