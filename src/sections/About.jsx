import React from "react";
import Reveal from "../components/Reveal";
import Heading from "../components/Heading";
import Counter from "../components/Counter";
import { PROFILE, ABOUT_STATS } from "../data/content";

// About glass card with bio text + animated stats.
export default function About() {
  return (
    <section id="about" className="section section-narrow">
      <Heading kicker="Profile" title="About Me" />
      <Reveal>
        <div className="grad-border glass about-card">
          <p className="about-text">{PROFILE.aboutText}</p>
          <div className="about-stats">
            {ABOUT_STATS.map(([label, n, suf], i) => (
              <Reveal key={label} delay={i * 120}>
                <div className="stat">
                  <div className="stat-num">
                    <Counter to={n} suffix={suf} />
                  </div>
                  <div className="stat-label">{label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
