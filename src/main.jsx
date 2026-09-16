import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { initAnalytics } from "./lib/analytics.js";
import "./styles/global.css";

const root = document.getElementById("root");
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Būvētajā vietnē katrs ceļš jau ir gatavs HTML (scripts/prerender.mjs),
// tāpēc React to "atdzīvina", nevis zīmē no jauna. Izstrādē root ir tukšs.
if (root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}

initAnalytics();
