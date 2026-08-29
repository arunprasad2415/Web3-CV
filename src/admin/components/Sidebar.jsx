// Small monochrome line icons, inline — matches the site's own Icons.jsx
// approach (no icon library dependency).
const NavIcon = {
  overview: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  ),
  profile: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.5-4 5-6 7.5-6s6 2 7.5 6" />
    </svg>
  ),
  stats: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <path d="M4 20V10M12 20V4M20 20v-7" />
    </svg>
  ),
  experience: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  skills: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <path d="M12 2 3 7l9 5 9-5-9-5Z" />
      <path d="M3 17l9 5 9-5M3 12l9 5 9-5" />
    </svg>
  ),
  nft: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="M21 15l-5-5-9 9" />
    </svg>
  ),
  achievements: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <circle cx="12" cy="8" r="5" />
      <path d="M8.5 12.5 7 21l5-3 5 3-1.5-8.5" />
    </svg>
  ),
  goals: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.8" fill="currentColor" />
    </svg>
  ),
  threads: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <path d="M21 11.5a8.5 8.5 0 0 1-12.8 7.3L3 20l1.3-5A8.5 8.5 0 1 1 21 11.5Z" />
    </svg>
  ),
  socials: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M8.2 10.8 15.8 7.2M8.2 13.2l7.6 3.6" />
    </svg>
  ),
};

export const SECTIONS = [
  { id: "overview", label: "Overview", icon: "overview" },
  { id: "profile", label: "Profile & Hero", icon: "profile" },
  { id: "stats", label: "About Stats", icon: "stats" },
  { id: "experience", label: "Experience", icon: "experience" },
  { id: "skills", label: "Skills", icon: "skills" },
  { id: "nft", label: "NFT Collections", icon: "nft" },
  { id: "achievements", label: "Achievements", icon: "achievements" },
  { id: "goals", label: "Goals", icon: "goals" },
  { id: "threads", label: "Content & Threads", icon: "threads" },
  { id: "socials", label: "Socials", icon: "socials" },
];

export default function Sidebar({ active, onSelect, dirtySections, onClose }) {
  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-mark">◇</span>
        <span>Admin</span>
      </div>
      <div className="sidebar-nav">
        {SECTIONS.map((s) => {
          const Icon = NavIcon[s.icon];
          const isActive = active === s.id;
          return (
            <button
              key={s.id}
              type="button"
              className={`sidebar-item ${isActive ? "sidebar-item-active" : ""}`}
              onClick={() => {
                onSelect(s.id);
                onClose?.();
              }}
            >
              <Icon className="sidebar-item-icon" />
              <span>{s.label}</span>
              {dirtySections?.has(s.id) && <span className="sidebar-item-dot" title="Unsaved changes" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
