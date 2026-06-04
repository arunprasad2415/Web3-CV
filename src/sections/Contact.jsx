import React from "react";
import Reveal from "../components/Reveal";
import Heading from "../components/Heading";
import { Icon } from "../components/Icons";
import { SOCIALS, PROFILE } from "../data/content";

// Contact card with floating animated social icons + email.
export default function Contact() {
  // Opens Gmail's compose window in a new tab, pre-filled with your
  // address + subject. Works in any browser without a mail app set up.
  const gmail =
    `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(PROFILE.email)}` +
    (PROFILE.emailSubject ? `&su=${encodeURIComponent(PROFILE.emailSubject)}` : "");
  const links = [...SOCIALS, { key: "Email", label: "Email", href: gmail }];
  return (
    <section id="contact" className="section section-narrow-md">
      <Heading kicker="Get in touch" title="Contact" />
      <Reveal>
        <div className="grad-border glass contact-card">
          <p className="contact-text">
            Open to Web3 research roles, community contributions, and ecosystem collaborations. Reach out on any platform below.
          </p>
          <div className="contact-icons">
            {links.map((s, i) => {
              const C = Icon[s.key];
              return (
                <Reveal key={s.key} delay={i * 90}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="contact-icon"
                    style={{ animation: "float 4s ease-in-out infinite", animationDelay: `${i * 0.25}s` }}
                  >
                    <C className="contact-icon-svg" />
                  </a>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Reveal>
    </section>
  );
}