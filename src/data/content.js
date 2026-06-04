// ============================================================
//  EDIT YOUR CONTENT HERE — everything text/link related lives
//  in this one file so you don't have to touch the components.
// ============================================================

import profilePic from "../assets/profile.jpg";
import nft1 from "../assets/nft1.jpg"
import GRIT from "../assets/GRIT.jpg"
import MOE from "../assets/moemoe.jpg"
import Lightka from "../assets/Lightka.jpg"
import Madoll from "../assets/Madoll.jpg"
import tweet1 from "../assets/tweet1.jpg";
import tweet2 from "../assets/tweet2.jpg";
import tweet3 from "../assets/tweet3.jpg";


// --- Your social links (used in top nav + contact section) ---
export const SOCIALS = [
  { key: "Telegram", label: "Telegram", href: "https://t.me/Arunajai0" },
  { key: "X", label: "X (Twitter)", href: "https://x.com/Waifudropz" },
  { key: "Discord", label: "Discord", href: "https://discord.com/users/872683929407225906" },
  { key: "Github", label: "GitHub", href: "https://github.com/arunprasad2415" },
];

// --- Hero typing words ---
export const TYPER_WORDS = [
  "Early Project Hunter",
  "Web3 Researcher",
  "NFT Researcher",
  "Community Builder",
];

// --- About stats ([label, number, suffix]) ---
export const ABOUT_STATS = [
  ["Years in Web3", 4, "+"],
  ["Projects Explored", 100, "+"],
  ["Communities Joined", 5, "+"],
];

// --- Skill groups (each item: [name, percentage]) ---
export const SKILL_GROUPS = [
  {
    title: "Web3 Research",
    items: [
      ["Early Project Discovery", 92],
      ["Ecosystem Analysis", 88],
      ["Mainnet Tracking", 85],
      ["Blockchain Fundamentals", 90],
    ],
  },
  {
    title: "Community & Growth",
    items: [
      ["Community Engagement", 94],
      ["Social Growth", 87],
      ["Project Research", 90],
      ["Content Sharing", 83],
      ["User Onboarding", 86],
    ],
  },
];

export const TECH_SKILLS = [
  "HTML",
  "CSS",
  "JavaScript",
  "React JS",
  "Node.js",
  "MongoDB",
  "Git & GitHub",
];

export const TOOLS = [
  "DeFiLlama",
  "Dune",
  "Arkham",
  "Discord",
  "Telegram",
  "X (Twitter)",
  "Notion",
  "Canva",
  "DexScreener",
  "Vulcan",
  "MEE6",
  "Arcane",
  "Collab.Land",
  "Matrica",
  "Guild.xyz",
];

// --- AI & Automation tools ---
export const AI_TOOLS = [
  "Claude",
  "ChatGPT",
  "Hermes",
  "OpenClaw",
  "LLM APIs",
];

// --- Experience timeline (top to bottom) ---
export const EXPERIENCE = [
  {
    role: "Open To New Roles",
    meta: "Available · Mod · Community Manager · Ambassador",
    badge: "Open",
    points: [
      "Actively seeking Moderator, Community Manager, and Ambassador positions",
      "Available to contribute to emerging Web3 and NFT projects",
      "Open to both part-time and full-time community roles",
    ],
  },
  {
    role: "Collab Manager — Project GRIT",
    meta: "Current · Japanese-based NFT Collection",
    badge: "Current",
    points: [
      "Managing collaborations and partnerships for a Japanese-based NFT collection",
      "Coordinating cross-community campaigns and whitelist initiatives",
      "Building relationships with partner projects and communities",
      "Driving community growth and engagement",
    ],
  },
  {
    role: "Web3 Research Contributor",
    points: [
      "Researched emerging blockchain ecosystems",
      "Identified promising early-stage projects",
      "Participated in community activities",
      "Shared ecosystem updates and findings",
    ],
  },
  {
    role: "Community Moderator / Contributor",
    points: [
      "Assisted community members",
      "Helped onboard new users",
      "Performed ecosystem testing",
      "Submitted feedback",
      "Documented project progress",
    ],
  },
  {
    role: "Content & Social Contributor",
    points: ["Created educational threads", "Shared project updates"],
  },
];

// --- NFT cards (leave image null to show the empty "add" placeholder) ---
export const NFT_COLLECTIONS = [
  { name: "Yumemono", image: nft1 },
  { name: "GRIT.", image: GRIT },
  { name: "moemoe", image: MOE },
  { name: "Lightka", image:Lightka },
  { name: "MAdoll", image: Madoll}
];

// --- Achievements ([label, number]) ---
export const ACHIEVEMENTS = [
  ["Collabs Secured", 4],
  ["NFT Spots Given Away", 20],
  ["Early Projects Spotted", 50],
];

// --- 2026 goals ---
export const GOALS = [
  "Become a recognized Web3 researcher",
  "Join a leading blockchain project",
  "Contribute to ecosystem growth",
  "Expand technical blockchain knowledge",
  "Build Web3 products",
  "Become an ambassador for major projects",
  "Learn smart contract development",
  "Explore AI + Blockchain integration",
];

// --- Misc personal info ---
export const PROFILE = {
  name: "Waifu Drops",
  initials: "WD",
  // Your profile picture (file lives in src/assets/profile.jpg).
  // Set to null to fall back to the initials above.
  photo: profilePic,
  title: "Web3 Researcher & Community Contributor",
  email: "arunprasad2415@gmail.com",
  emailSubject: "Web3 opportunity",
  aboutText:
    "Passionate Web3 enthusiast focused on discovering early-stage projects, researching ecosystems, participating in testnets, exploring NFT communities, and helping users find opportunities in the blockchain space.",
  footerTagline: "Building the future of Web3, one ecosystem at a time.",
};

export const TWEETS = [
 {
     text: "About Efdot Studio",
     date: "may 2026",
     url: "https://x.com/Waifudropz/status/...",
     image: tweet1,
     pinned: true,
   },
  {
    text: "Alpa - Ordinal Genesis",
    date: "March 2026",
    url: "https://x.com/Waifudropz/status/2032507098714746937?s=20",
    image: tweet2
  },
  {
    text: "NFT Alpha",
    date: "May 2026",
    url: "https://x.com/Waifudropz/status/2059137043981361184?s=20",
    image: tweet3
  },
];