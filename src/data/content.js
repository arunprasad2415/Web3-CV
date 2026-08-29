// ============================================================
//  Content is now data-driven from content.json so the admin
//  panel (/admin) can edit it. Don't hand-edit fields here —
//  edit content.json (or use the admin panel) instead.
// ============================================================
import data from "./content.json";
import { isKeyValid, SAFE_DEFAULTS } from "../lib/validateContent.js";

// The admin panel validates before it saves, but content.json can also be
// edited directly (git) and land here unvalidated. Fall back per-key on a
// safe empty shape instead of letting a bad value crash a section component.
function safe(key) {
  const value = data[key];
  if (isKeyValid(key, value)) return value;
  console.error(`content.json: "${key}" is malformed, using an empty fallback instead.`);
  return SAFE_DEFAULTS[key];
}

export const SOCIALS = safe("SOCIALS");
export const TYPER_WORDS = safe("TYPER_WORDS");
export const ABOUT_STATS = safe("ABOUT_STATS");
export const SKILL_GROUPS = safe("SKILL_GROUPS");
export const TECH_SKILLS = safe("TECH_SKILLS");
export const TOOLS = safe("TOOLS");
export const AI_TOOLS = safe("AI_TOOLS");
export const EXPERIENCE = safe("EXPERIENCE");
export const NFT_COLLECTIONS = safe("NFT_COLLECTIONS");
export const ACHIEVEMENTS = safe("ACHIEVEMENTS");
export const GOALS = safe("GOALS");
export const PROFILE = safe("PROFILE");
export const TWEETS = safe("TWEETS");
