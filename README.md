# Web3 Portfolio

A premium black-themed Web3 / CV portfolio built with **React + Vite**.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build into /dist
npm run preview  # preview the build
```

## Where everything lives

```
web3-portfolio/
├── index.html                  # HTML entry, loads Google Fonts
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                # React entry point
    ├── App.jsx                 # Assembles all sections in order
    │
    ├── data/
    │   └── content.js          # ★ EDIT YOUR CONTENT HERE — name, links,
    │                           #   skills, experience, NFTs, goals, etc.
    │
    ├── hooks/
    │   └── index.js            # useReveal, useScrollY, useBlackBody
    │
    ├── components/             # Small reusable pieces
    │   ├── Icons.jsx           # Brand SVG logos (TG, X, Discord, GitHub, Email)
    │   ├── Reveal.jsx          # Scroll-in fade/slide/blur wrapper
    │   ├── Counter.jsx         # Count-up number animation
    │   ├── Typer.jsx           # Hero typing effect
    │   ├── Particles.jsx       # Animated star/particle canvas
    │   ├── Heading.jsx         # Section heading
    │   ├── SkillBar.jsx        # Animated skill progress bar
    │   └── Loader.jsx          # Intro loading screen
    │
    ├── sections/               # One file per page section
    │   ├── Navbar.jsx          # Top nav + social icons
    │   ├── Hero.jsx            # Landing / intro
    │   ├── About.jsx           # Bio + stats
    │   ├── Skills.jsx          # Skill bars + tech + tools
    │   ├── Experience.jsx      # Timeline
    │   ├── NFTShowcase.jsx     # NFT gallery (empty cards to fill)
    │   ├── Achievements.jsx    # Counters
    │   ├── Goals.jsx           # 2026 roadmap
    │   ├── Contact.jsx         # Contact card + socials
    │   └── Footer.jsx          # Footer
    │
    └── styles/                 # CSS, split to match the sections
        ├── global.css          # Variables, resets, fonts, keyframes,
        │                       #   shared utilities — imports the rest
        ├── layout.css          # App shell, sections, heading, loader, navbar
        ├── hero.css            # Hero
        ├── about-skills.css    # About + Skills
        ├── experience.css      # Timeline
        └── sections.css        # NFT, Achievements, Goals, Contact, Footer
```

## Customizing

1. **Text, links, numbers** → `src/data/content.js`. You almost never need to
   touch the components. Update `SOCIALS`, `PROFILE`, `EXPERIENCE`, `TOOLS`, etc.
2. **NFT images** → in `content.js`, set the `image` field of an entry in
   `NFT_COLLECTIONS` to an image URL/path (leave `null` for the empty placeholder).
3. **Colors** → CSS variables at the top of `src/styles/global.css`
   (`--black`, `--white`, `--silver`, …).
4. **Section order** → `src/App.jsx`.
5. **A specific section's look** → its matching file in `src/styles/`.

## Notes

- No Tailwind required — all styling is plain CSS in `src/styles/`.
- Fonts (Sora + Syne) are loaded via `<link>` in `index.html`.
- The "Download CV" button currently scrolls to Contact; point it at your
  CV file when you have one (edit `src/sections/Hero.jsx`).
```
