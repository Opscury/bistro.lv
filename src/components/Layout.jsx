import { useMemo } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import usePageMeta from "../hooks/usePageMeta.js";
import { jsonLd } from "../data/lines.js";
import { useSite } from "../lib/content.jsx";

export default function Layout() {
  usePageMeta();
  const site = useSite();
  const ld = useMemo(() => JSON.stringify(jsonLd(site)), [site]);

  return (
    <>
      <a className="skip-link" href="#main">
        Pāriet uz saturu
      </a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld }} />
    </>
  );
}
