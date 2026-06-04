import React from "react";
import Reveal from "./Reveal";

// Centered section heading with kicker + gradient title + divider.
export default function Heading({ kicker, title }) {
  return (
    <Reveal>
      <div className="heading">
        <p className="heading-kicker">{kicker}</p>
        <h2 className="heading-title">
          <span className="grad-text">{title}</span>
        </h2>
        <div className="heading-divider" />
      </div>
    </Reveal>
  );
}
