import React from "react";
import { PROFILE } from "../data/content";

// Footer with shimmering tagline + glow.
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid" />
      <div className="footer-glow" />
      <p className="footer-tagline">
        <span className="footer-tagline-text">{PROFILE.footerTagline}</span>
      </p>
      <p className="footer-copy">
        © {new Date().getFullYear()} {PROFILE.name} · Web3 Researcher
      </p>
    </footer>
  );
}
