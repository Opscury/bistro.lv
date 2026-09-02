import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Home from "./pages/Home.jsx";
import Bistro from "./pages/Bistro.jsx";
import Konditoreja from "./pages/Konditoreja.jsx";
import TejasNamins from "./pages/TejasNamins.jsx";
import Noma from "./pages/Noma.jsx";
import Banketi from "./pages/Banketi.jsx";
import Kontakti from "./pages/Kontakti.jsx";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/bistro" element={<Bistro />} />
          <Route path="/konditoreja" element={<Konditoreja />} />
          <Route path="/tejas-namins" element={<TejasNamins />} />
          <Route path="/noma" element={<Noma />} />
          <Route path="/banketi" element={<Banketi />} />
          <Route path="/kontakti" element={<Kontakti />} />
        </Route>
      </Routes>
    </>
  );
}
