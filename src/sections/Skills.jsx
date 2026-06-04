import React from "react";
import Reveal from "../components/Reveal";
import Heading from "../components/Heading";
import SkillBar from "../components/SkillBar";
import { SKILL_GROUPS, TECH_SKILLS, TOOLS, AI_TOOLS } from "../data/content";

// Skills: grouped progress bars + tech pills + tools pills.
export default function Skills() {
  return (
    <section id="skills" className="section">
      <Heading kicker="Expertise" title="Skills" />

      <div className="skills-grid">
        {SKILL_GROUPS.map((g, gi) => (
          <Reveal key={g.title} delay={gi * 150} dir={gi % 2 ? "left" : "right"}>
            <div className="grad-border glow-hover glass skill-card">
              <h3 className="skill-card-title">{g.title}</h3>
              <div className="skill-card-bars">
                {g.items.map(([name, pct]) => (
                  <SkillBar key={name} name={name} pct={pct} />
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <h3 className="pills-title">Technical Skills</h3>
      </Reveal>
      <div className="pills">
        {TECH_SKILLS.map((t, i) => (
          <Reveal key={t} delay={i * 70} className="pill-wrap">
            <span className="glow-hover pill">{t}</span>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <h3 className="pills-title pills-title-mt">Tools</h3>
      </Reveal>
      <div className="pills">
        {TOOLS.map((t, i) => (
          <Reveal key={t} delay={i * 60} className="pill-wrap">
            <span className="glow-hover pill">{t}</span>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <h3 className="pills-title pills-title-mt">AI &amp; Automation</h3>
      </Reveal>
      <div className="pills">
        {AI_TOOLS.map((t, i) => (
          <Reveal key={t} delay={i * 60} className="pill-wrap">
            <span className="glow-hover pill">{t}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}