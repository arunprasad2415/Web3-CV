import React from "react";
import Reveal from "../components/Reveal";
import Heading from "../components/Heading";
import Counter from "../components/Counter";
import { ACHIEVEMENTS } from "../data/content";

// Glowing achievement counters.
export default function Achievements() {
  return (
    <section id="achievements" className="section">
      <Heading kicker="Milestones" title="Achievements" />
      <div className="achievements-grid">
        {ACHIEVEMENTS.map(([label, n], i) => (
          <Reveal key={label} delay={i * 120}>
            <div className="grad-border glow-hover glass achievement-card">
              <div className="achievement-num">
                <Counter to={n} suffix="+" />
              </div>
              <p className="achievement-label">{label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
