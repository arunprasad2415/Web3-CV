import React from "react";
import Reveal from "../components/Reveal";
import Typer from "../components/Typer";
import CursorScrubVideo from "../components/CursorScrubVideo";
import { PROFILE, TYPER_WORDS } from "../data/content";

const HERO_VIDEO = "/videos/hero-head.mp4";

// Full-screen landing hero with avatar, typing effect, particles, CTAs.
export default function Hero({ scrollY, scrollTo }) {
  return (
    <section id="hero" className="hero">
      <div className="hero-video-bg">
        <CursorScrubVideo src={HERO_VIDEO} axis="horizontal" objectFit="cover" className="hero-video-bg-el" />
        <div className="hero-video-scrim" />
      </div>
      <div className="hero-grid" />
      <div className="hero-glow" />
      <div
        className="hero-content"
        style={{ transform: `translateY(${scrollY * 0.18}px)`, opacity: Math.max(0, 1 - scrollY / 600) }}
      >
        <Reveal delay={300}>
          <h1 className="hero-name">{PROFILE.name}</h1>
        </Reveal>
        <Reveal delay={420}>
          <p className="hero-title">{PROFILE.title}</p>
        </Reveal>
        <Reveal delay={540}>
          <div className="hero-typer">
            <span className="hero-typer-prefix">I am an </span>
            <Typer words={TYPER_WORDS} />
          </div>
        </Reveal>
        <Reveal delay={680}>
          <div className="hero-buttons">
            <button onClick={() => scrollTo("contact")} className="btn btn-solid">
              Contact Me
            </button>
            <button onClick={() => scrollTo("nft")} className="btn btn-ghost">
              View Portfolio
            </button>
          </div>
        </Reveal>
      </div>
      <div className="hero-scroll">
        <span>SCROLL</span>
      </div>
    </section>
  );
}