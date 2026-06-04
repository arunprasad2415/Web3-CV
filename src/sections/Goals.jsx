import React from "react";
import Reveal from "../components/Reveal";
import Heading from "../components/Heading";
import { GOALS } from "../data/content";

// 2026 roadmap goal cards, numbered.
export default function Goals() {
  return (
    <section id="goals" className="section section-narrow-lg">
      <Heading kicker="Roadmap" title="2026 Goals" />
      <div className="goals-grid">
        {GOALS.map((g, i) => (
          <Reveal key={g} delay={i * 90} dir={i % 2 ? "left" : "right"}>
            <div className="grad-border glow-hover glass goal-card">
              <span className="goal-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="goal-text">{g}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
