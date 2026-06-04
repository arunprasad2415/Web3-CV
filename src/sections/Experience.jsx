import React from "react";
import Reveal from "../components/Reveal";
import Heading from "../components/Heading";
import { EXPERIENCE } from "../data/content";

// Animated vertical timeline of experience entries.
export default function Experience() {
  return (
    <section id="experience" className="section section-narrow-md">
      <Heading kicker="Journey" title="Experience" />
      <div className="timeline">
        <div className="timeline-line" />
        {EXPERIENCE.map((e, i) => (
          <Reveal key={e.role} delay={i * 120} dir={i % 2 ? "left" : "right"}>
            <div className={`timeline-item ${i % 2 ? "timeline-item-right" : "timeline-item-left"}`}>
              <span className={`timeline-dot ${i % 2 ? "timeline-dot-right" : "timeline-dot-left"}`}>
                <span className="timeline-dot-inner" />
              </span>
              <div className="grad-border glow-hover glass timeline-card">
                <div className="timeline-card-head">
                  <h3 className="timeline-role">{e.role}</h3>
                  {e.badge && <span className="timeline-badge">{e.badge}</span>}
                </div>
                {e.meta && <p className="timeline-meta">{e.meta}</p>}
                <ul className="timeline-points">
                  {e.points.map((p) => (
                    <li key={p} className="timeline-point">
                      <span className="timeline-bullet" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
