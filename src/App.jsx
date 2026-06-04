import React, { useState, useEffect, useCallback } from "react";
import { useScrollY, useBlackBody } from "./hooks";

import Loader from "./components/Loader";
import SakuraPetals from "./components/SakuraPetals";
import CursorGlow from "./components/CursorGlow";
import BackToTop from "./components/BackToTop";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Experience from "./sections/Experience";
import NFTShowcase from "./sections/NFTShowcase";
import ContentThreads from "./sections/ContentThreads";
import Achievements from "./sections/Achievements";
import Goals from "./sections/Goals";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";

export default function App() {
  const [loading, setLoading] = useState(true);
  const scrollY = useScrollY();
  useBlackBody();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1900);
    return () => clearTimeout(t);
  }, []);

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="app">
      <CursorGlow />
      <SakuraPetals count={typeof window !== "undefined" && window.innerWidth < 640 ? 14 : 28} />
      <Loader loading={loading} />
      <Navbar scrollY={scrollY} scrollTo={scrollTo} />
      <Hero scrollY={scrollY} scrollTo={scrollTo} />
      <About />
      <Skills />
      <Experience />
      <NFTShowcase />
      <ContentThreads />
      <Achievements />
      <Goals />
      <Contact />
      <Footer />
      <BackToTop />
    </div>
  );
}