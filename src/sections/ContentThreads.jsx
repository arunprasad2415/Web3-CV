import React from "react";
import Reveal from "../components/Reveal";
import Heading from "../components/Heading";
import { Icon } from "../components/Icons";
import { TWEETS, PROFILE, SOCIALS } from "../data/content";

// "Content & Threads" — styled tweet cards that match the site theme
// and link out to the real posts on X.
export default function ContentThreads() {
  // grab the X handle from your socials for display
  const xLink = SOCIALS.find((s) => s.key === "X");
  const handle = xLink ? "@" + xLink.href.replace(/\/+$/, "").split("/").pop() : "@you";

  return (
    <section id="threads" className="section">
      <Heading kicker="Content & Social" title="Content & Threads" />
      <div className="threads-grid">
        {TWEETS.map((t, i) => (
          <Reveal key={i} delay={i * 120}>
            <a
              href={t.url}
              target="_blank"
              rel="noreferrer"
              className="grad-border glow-hover glass thread-card"
            >
              <div className="thread-head">
                <div className="thread-avatar">
                  {PROFILE.photo ? (
                    <img src={PROFILE.photo} alt={PROFILE.name} className="thread-avatar-img" />
                  ) : (
                    <span>{PROFILE.initials}</span>
                  )}
                </div>
                <div className="thread-id">
                  <span className="thread-name">{PROFILE.name}</span>
                  <span className="thread-handle">{handle}</span>
                </div>
                <Icon.X className="thread-x" />
              </div>

              <p className="thread-text">{t.text}</p>

              {t.image && (
                <div className="thread-media">
                  <img src={t.image} alt="" className="thread-media-img" />
                </div>
              )}

              <div className="thread-foot">
                {t.pinned && <span className="thread-pin">📌 Pinned</span>}
                <span className="thread-date">{t.date}</span>
                <span className="thread-link">View on X →</span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}