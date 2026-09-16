import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import usePageMeta from "../hooks/usePageMeta.js";
import { jsonLd } from "../data/lines.js";

const LD = JSON.stringify(jsonLd());

export default function Layout() {
  usePageMeta();

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: LD }} />
    </>
  );
}
