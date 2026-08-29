export default function SaveBar({ dirty, saving, savedAt, onSave, onDiscard, onLogout, onMenu }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button type="button" className="topbar-menu-btn" onClick={onMenu} aria-label="Open menu">
          ☰
        </button>
        <span className="topbar-status">
          {dirty ? (
            <span className="status-dot status-dot-pending" />
          ) : (
            <span className="status-dot status-dot-ok" />
          )}
          {dirty ? "Unsaved changes" : savedAt ? `Saved · ${savedAt}` : "Up to date"}
        </span>
      </div>
      <div className="topbar-right">
        <a href="/" target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
          View Portfolio
        </a>
        {dirty && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={onDiscard} disabled={saving}>
            Discard
          </button>
        )}
        <button type="button" className="btn btn-solid btn-sm" onClick={onSave} disabled={saving || !dirty}>
          {saving ? "Saving…" : "Save Changes"}
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onLogout}>
          Log out
        </button>
      </div>
    </header>
  );
}
