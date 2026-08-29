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
    │   ├── content.json        # ★ ALL YOUR CONTENT — name, links, skills,
    │   │                       #   experience, NFTs, goals, etc. Edit this
    │   │                       #   file directly, or use /admin (see below).
    │   └── content.js          # thin re-export of content.json, don't edit
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

1. **Text, links, numbers** → `src/data/content.json`. You almost never need to
   touch the components. Update `SOCIALS`, `PROFILE`, `EXPERIENCE`, `TOOLS`, etc.
2. **NFT / tweet / profile images** → live in `public/images/`, referenced by
   path (e.g. `/images/nft1.jpg`) from `content.json`.
3. **Colors** → CSS variables at the top of `src/styles/global.css`
   (`--black`, `--white`, `--silver`, …).
4. **Section order** → `src/App.jsx`.
5. **A specific section's look** → its matching file in `src/styles/`.

## Admin panel (`/admin`)

Edit the live site's content from a browser instead of git — save commits
straight to this repo's `main` branch and Vercel auto-redeploys.

**Setup (one time), in the Vercel project's Environment Variables:**

| Variable         | Value                                                              |
|------------------|---------------------------------------------------------------------|
| `ADMIN_PASSWORD` | Password you'll use to log into `/admin`                            |
| `ADMIN_SECRET`   | Any long random string (used to sign the login session cookie)      |
| `GITHUB_TOKEN`   | A GitHub personal access token with `repo` (or fine-grained "Contents: Read and write") scope on this repo |
| `GITHUB_OWNER`   | `arunprasad2415`                                                     |
| `GITHUB_REPO`    | `Web3-CV`                                                            |
| `GITHUB_BRANCH`  | `main` (optional, defaults to `main`)                                |

Redeploy after adding these. Then visit `https://waifudrops.xyz/admin`,
log in, edit the JSON, and hit **Save & Deploy**. Image slots (profile
photo, NFT cards, tweet screenshots) can be replaced in place from the same
page without touching the JSON.

`npm run dev` only serves the frontend — the `/api` functions need
`vercel dev` (or Vercel's dashboard) to run, since they're serverless
functions, not part of the Vite dev server.

## Notes

- No Tailwind required — all styling is plain CSS in `src/styles/`.
- Fonts (Sora + Syne) are loaded via `<link>` in `index.html`.
- The "Download CV" button currently scrolls to Contact; point it at your
  CV file when you have one (edit `src/sections/Hero.jsx`).
```
