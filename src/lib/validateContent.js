// Structural validation for content.json. Runs both server-side (the
// authoritative check, in api/save-content.js) and client-side in the admin
// UI for immediate feedback. Keeps the public portfolio from breaking on a
// malformed save (e.g. a section component doing `.map()` on a non-array).
//
// Intentionally shape-only (right keys, right types) — not a full schema
// validator, just enough to catch what would crash a component.

const isStr = (v) => typeof v === "string";
const isNum = (v) => typeof v === "number" && Number.isFinite(v);
const isArr = Array.isArray;
const isObj = (v) => v !== null && typeof v === "object" && !isArr(v);

function arrayOf(itemCheck) {
  return (v, path, errors) => {
    if (!isArr(v)) return errors.push(`${path} must be an array`);
    v.forEach((item, i) => itemCheck(item, `${path}[${i}]`, errors));
  };
}

function stringArrayItem(v, path, errors) {
  if (!isStr(v)) errors.push(`${path} must be a string`);
}

function statTuple(v, path, errors) {
  if (!isArr(v) || v.length < 2) return errors.push(`${path} must be [label, number, suffix?]`);
  if (!isStr(v[0])) errors.push(`${path}[0] (label) must be a string`);
  if (!isNum(v[1])) errors.push(`${path}[1] (number) must be a number`);
  if (v[2] !== undefined && !isStr(v[2])) errors.push(`${path}[2] (suffix) must be a string`);
}

function achievementTuple(v, path, errors) {
  if (!isArr(v) || v.length < 2) return errors.push(`${path} must be [label, number]`);
  if (!isStr(v[0])) errors.push(`${path}[0] (label) must be a string`);
  if (!isNum(v[1])) errors.push(`${path}[1] (number) must be a number`);
}

function skillItem(v, path, errors) {
  if (!isArr(v) || v.length < 2) return errors.push(`${path} must be [name, percentage]`);
  if (!isStr(v[0])) errors.push(`${path}[0] (name) must be a string`);
  if (!isNum(v[1])) errors.push(`${path}[1] (percentage) must be a number`);
}

function socialItem(v, path, errors) {
  if (!isObj(v)) return errors.push(`${path} must be an object`);
  if (!isStr(v.key)) errors.push(`${path}.key must be a string`);
  if (!isStr(v.label)) errors.push(`${path}.label must be a string`);
  if (!isStr(v.href)) errors.push(`${path}.href must be a string`);
}

function skillGroupItem(v, path, errors) {
  if (!isObj(v)) return errors.push(`${path} must be an object`);
  if (!isStr(v.title)) errors.push(`${path}.title must be a string`);
  arrayOf(skillItem)(v.items, `${path}.items`, errors);
}

function experienceItem(v, path, errors) {
  if (!isObj(v)) return errors.push(`${path} must be an object`);
  if (!isStr(v.role)) errors.push(`${path}.role must be a string`);
  if (v.meta !== undefined && !isStr(v.meta)) errors.push(`${path}.meta must be a string`);
  if (v.badge !== undefined && !isStr(v.badge)) errors.push(`${path}.badge must be a string`);
  arrayOf(stringArrayItem)(v.points, `${path}.points`, errors);
}

function nftItem(v, path, errors) {
  if (!isObj(v)) return errors.push(`${path} must be an object`);
  if (!isStr(v.name)) errors.push(`${path}.name must be a string`);
  if (v.image !== null && !isStr(v.image)) errors.push(`${path}.image must be a string or null`);
}

function tweetItem(v, path, errors) {
  if (!isObj(v)) return errors.push(`${path} must be an object`);
  if (!isStr(v.text)) errors.push(`${path}.text must be a string`);
  if (!isStr(v.date)) errors.push(`${path}.date must be a string`);
  if (!isStr(v.url)) errors.push(`${path}.url must be a string`);
  if (v.image !== undefined && v.image !== null && !isStr(v.image))
    errors.push(`${path}.image must be a string`);
  if (v.pinned !== undefined && typeof v.pinned !== "boolean")
    errors.push(`${path}.pinned must be a boolean`);
}

function profileCheck(v, path, errors) {
  if (!isObj(v)) return errors.push(`${path} must be an object`);
  const requiredStrings = ["name", "initials", "title", "email", "emailSubject", "aboutText", "footerTagline"];
  requiredStrings.forEach((k) => {
    if (!isStr(v[k])) errors.push(`${path}.${k} must be a string`);
  });
  if (v.photo !== null && !isStr(v.photo)) errors.push(`${path}.photo must be a string or null`);
}

const SCHEMA = {
  SOCIALS: arrayOf(socialItem),
  TYPER_WORDS: arrayOf(stringArrayItem),
  ABOUT_STATS: arrayOf(statTuple),
  SKILL_GROUPS: arrayOf(skillGroupItem),
  TECH_SKILLS: arrayOf(stringArrayItem),
  TOOLS: arrayOf(stringArrayItem),
  AI_TOOLS: arrayOf(stringArrayItem),
  EXPERIENCE: arrayOf(experienceItem),
  NFT_COLLECTIONS: arrayOf(nftItem),
  ACHIEVEMENTS: arrayOf(achievementTuple),
  GOALS: arrayOf(stringArrayItem),
  PROFILE: profileCheck,
  TWEETS: arrayOf(tweetItem),
};

// Per-key check, used by content.js to fall back safely on a single bad key
// instead of the whole module blowing up (e.g. content.json edited by hand
// or pushed directly to git, bypassing the admin panel's own validation).
export function isKeyValid(key, value) {
  if (!(key in SCHEMA)) return true;
  const errors = [];
  SCHEMA[key](value, key, errors);
  return errors.length === 0;
}

// Safe fallback values, one per SCHEMA key — empty/neutral shapes a section
// component can render without crashing.
export const SAFE_DEFAULTS = {
  SOCIALS: [],
  TYPER_WORDS: [],
  ABOUT_STATS: [],
  SKILL_GROUPS: [],
  TECH_SKILLS: [],
  TOOLS: [],
  AI_TOOLS: [],
  EXPERIENCE: [],
  NFT_COLLECTIONS: [],
  ACHIEVEMENTS: [],
  GOALS: [],
  PROFILE: {
    name: "",
    initials: "",
    photo: null,
    title: "",
    email: "",
    emailSubject: "",
    aboutText: "",
    footerTagline: "",
  },
  TWEETS: [],
};

// Returns { valid: boolean, errors: string[] }
export function validateContent(content) {
  const errors = [];
  if (!isObj(content)) return { valid: false, errors: ["content must be a JSON object"] };

  for (const key of Object.keys(SCHEMA)) {
    if (!(key in content)) {
      errors.push(`missing required key "${key}"`);
      continue;
    }
    SCHEMA[key](content[key], key, errors);
  }

  const unknownKeys = Object.keys(content).filter((k) => !(k in SCHEMA));
  unknownKeys.forEach((k) => errors.push(`unknown key "${k}" (typo? it won't be used by the site)`));

  return { valid: errors.length === 0, errors };
}
