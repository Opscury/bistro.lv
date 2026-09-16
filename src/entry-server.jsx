// Servera ieeja — to lieto tikai scripts/prerender.mjs būvējot,
// lai katram ceļam uzrakstītu gatavu HTML. Pārlūkā to neielādē.

import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App.jsx";

export { routesMeta, SITE_URL } from "./data/meta.js";

export function render(url) {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );
}
