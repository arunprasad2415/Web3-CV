export default function OverviewSection({ content, savedAt, dirty, onNavigate }) {
  const cards = [
    { label: "Experience entries", value: content.EXPERIENCE.length, go: "experience" },
    { label: "NFT collections", value: content.NFT_COLLECTIONS.length, go: "nft" },
    { label: "Social links", value: content.SOCIALS.length, go: "socials" },
    { label: "Content threads", value: content.TWEETS.length, go: "threads" },
    { label: "Achievements", value: content.ACHIEVEMENTS.length, go: "achievements" },
    { label: "Goals", value: content.GOALS.length, go: "goals" },
    { label: "Skill groups", value: content.SKILL_GROUPS.length, go: "skills" },
    {
      label: "Managed images",
      value:
        (content.PROFILE.photo ? 1 : 0) +
        content.NFT_COLLECTIONS.filter((n) => n.image).length +
        content.TWEETS.filter((t) => t.image).length,
      go: "nft",
    },
  ];

  return (
    <div className="section-stack">
      <div className="overview-grid">
        {cards.map((c) => (
          <button key={c.label} type="button" className="stat-card glass grad-border" onClick={() => onNavigate(c.go)}>
            <span className="stat-card-value">{c.value}</span>
            <span className="stat-card-label">{c.label}</span>
          </button>
        ))}
      </div>

      <div className="overview-status glass grad-border">
        <div>
          <span className="f-label">Save status</span>
          <p className="overview-status-text">
            {dirty ? "You have unsaved changes." : savedAt ? `Everything is saved — last saved ${savedAt}.` : "Everything is saved."}
          </p>
        </div>
      </div>
    </div>
  );
}
