import React from "react";
import { Icon } from "../components/Icons";
import { SOCIALS } from "../data/content";

// Fixed top navigation: brand mark + social icon links.
export default function Navbar({ scrollY, scrollTo }) {
  return (
    <header className="nav">
      <div
        className="nav-inner"
        style={{
          backdropFilter: scrollY > 30 ? "blur(14px)" : "none",
          background: scrollY > 30 ? "rgba(5,5,5,0.6)" : "transparent",
          borderBottom: scrollY > 30 ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
        }}
      >
        <button onClick={() => scrollTo("hero")} className="nav-brand">
          ◇ PORTFOLIO
        </button>
        <div className="nav-socials">
          {SOCIALS.map((s) => {
            const C = Icon[s.key];
            return (
              <a key={s.key} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="social-pill">
                <C className="social-pill-icon" />
              </a>
            );
          })}
        </div>
      </div>
    </header>
  );
}
