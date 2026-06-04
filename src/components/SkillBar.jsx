import React from "react";
import { useReveal } from "../hooks";

// Animated horizontal skill bar that fills on reveal.
export default function SkillBar({ name, pct }) {
  const [ref, shown] = useReveal();
  return (
    <div ref={ref}>
      <div className="skillbar-label">
        <span className="skillbar-name">{name}</span>
        <span className="skillbar-pct">{pct}%</span>
      </div>
      <div className="skillbar-track">
        <div
          className="skillbar-fill"
          style={{
            width: shown ? `${pct}%` : "0%",
            transition: "width 1.4s cubic-bezier(.16,1,.3,1)",
          }}
        />
      </div>
    </div>
  );
}
