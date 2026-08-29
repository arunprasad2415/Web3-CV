// Turns a validateContent() error string like `EXPERIENCE[2].role must be
// a string` into something a non-developer can read, plus which sidebar
// section it belongs to (so the UI can jump there).

const SECTION_NAMES = {
  SOCIALS: "Socials",
  TYPER_WORDS: "Hero typing words",
  ABOUT_STATS: "About Stats",
  SKILL_GROUPS: "Skills",
  TECH_SKILLS: "Technical skills",
  TOOLS: "Tools",
  AI_TOOLS: "AI & Automation",
  EXPERIENCE: "Experience",
  NFT_COLLECTIONS: "NFT Collections",
  ACHIEVEMENTS: "Achievements",
  GOALS: "Goals",
  PROFILE: "Profile",
  TWEETS: "Content & Threads",
};

const SECTION_IDS = {
  SOCIALS: "socials",
  TYPER_WORDS: "profile",
  ABOUT_STATS: "stats",
  SKILL_GROUPS: "skills",
  TECH_SKILLS: "skills",
  TOOLS: "skills",
  AI_TOOLS: "skills",
  EXPERIENCE: "experience",
  NFT_COLLECTIONS: "nft",
  ACHIEVEMENTS: "achievements",
  GOALS: "goals",
  PROFILE: "profile",
  TWEETS: "threads",
};

export function humanizeContentError(raw) {
  const m = raw.match(/^([A-Z_]+)/);
  const key = m?.[1];
  const name = SECTION_NAMES[key];
  if (!name) return { text: raw, sectionId: null };

  let rest = raw.slice(key.length);
  rest = rest.replace(/\[(\d+)\]/g, (_, n) => ` #${Number(n) + 1}`);
  rest = rest.replace(/^\s*\./, " → ").trim();

  return { text: `${name} ${rest}`.replace(/\s+/g, " ").trim(), sectionId: SECTION_IDS[key] };
}

// Turns a caught network/JS error into something safe + readable — never
// shows "TypeError", "fetch failed", raw GitHub errors, etc.
export function humanizeCaughtError(err) {
  if (err?.message && /fetch|network|failed to fetch/i.test(err.message)) {
    return "Could not reach the server. Check your connection and try again.";
  }
  if (err?.message) return err.message;
  return "Something went wrong. Please try again.";
}
