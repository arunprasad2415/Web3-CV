import { useEffect, useMemo, useState } from "react";
import { Icon } from "../components/Icons.jsx";
import { validateContent } from "../lib/validateContent.js";
import { humanizeContentError, humanizeCaughtError } from "./lib/humanizeError.js";

import Sidebar, { SECTIONS } from "./components/Sidebar.jsx";
import SaveBar from "./components/SaveBar.jsx";
import ConfirmDialog from "./components/ConfirmDialog.jsx";

import OverviewSection from "./sections/OverviewSection.jsx";
import ProfileSection from "./sections/ProfileSection.jsx";
import AboutStatsSection from "./sections/AboutStatsSection.jsx";
import ExperienceSection from "./sections/ExperienceSection.jsx";
import SkillsSection from "./sections/SkillsSection.jsx";
import NFTSection from "./sections/NFTSection.jsx";
import AchievementsSection from "./sections/AchievementsSection.jsx";
import GoalsSection from "./sections/GoalsSection.jsx";
import ThreadsSection from "./sections/ThreadsSection.jsx";
import SocialsSection from "./sections/SocialsSection.jsx";

const SECTION_TITLES = Object.fromEntries(SECTIONS.map((s) => [s.id, s.label]));

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read the selected file"));
    reader.readAsDataURL(file);
  });
}

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const [content, setContent] = useState(null);
  const [savedSnapshot, setSavedSnapshot] = useState(null);
  const [sha, setSha] = useState(null);
  const [savedAt, setSavedAt] = useState(null);

  const [activeSection, setActiveSection] = useState("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [pendingImages, setPendingImages] = useState({}); // slotId -> {file, filename, previewUrl}
  const [imageErrors, setImageErrors] = useState({});

  const [loadingContent, setLoadingContent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { ok, text }
  const [validationErrors, setValidationErrors] = useState([]); // [{text, sectionId}]
  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);

  const dirty = useMemo(() => {
    if (!content || savedSnapshot === null) return false;
    return JSON.stringify(content) !== savedSnapshot || Object.keys(pendingImages).length > 0;
  }, [content, savedSnapshot, pendingImages]);

  // Warn on tab close/reload while there are unsaved changes.
  useEffect(() => {
    function handler(e) {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  async function loadContent() {
    setLoadingContent(true);
    setMessage(null);
    setValidationErrors([]);
    try {
      const res = await fetch("/api/content");
      if (res.status === 401) {
        setAuthed(false);
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not load the portfolio content.");
      setContent(data.content);
      setSavedSnapshot(JSON.stringify(data.content));
      setSha(data.sha);
      setPendingImages({});
      setImageErrors({});
      setAuthed(true);
    } catch (err) {
      setMessage({ ok: false, text: humanizeCaughtError(err) });
    } finally {
      setLoadingContent(false);
    }
  }

  // On mount: a GitHub OAuth login lands back here via a full-page redirect,
  // so we always have to ask the server whether the session is valid.
  useEffect(() => {
    (async () => {
      await loadContent();
      setCheckingSession(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function logout() {
    setAuthed(false);
    setContent(null);
    setSavedSnapshot(null);
    setSha(null);
    setPendingImages({});
    setMessage(null);
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch {
      // Cookie is cleared by the response header regardless of a network hiccup here.
    }
  }

  function updateKey(key) {
    return (value) => setContent((prev) => ({ ...prev, [key]: value }));
  }

  // Shared by every image-bearing section: stages a file locally (with a
  // preview) instead of uploading immediately. The real upload happens as
  // part of Save.
  function slotFor(slotId, currentPath, prefix, onPathChange) {
    const entry = pendingImages[slotId];
    return {
      previewUrl: entry ? entry.previewUrl : currentPath,
      hasImage: Boolean(entry ? entry.previewUrl : currentPath),
      pending: Boolean(entry),
      error: imageErrors[slotId] || null,
      onSelectFile: (file, err) => {
        if (err) {
          setImageErrors((e) => ({ ...e, [slotId]: err }));
          return;
        }
        setImageErrors((e) => ({ ...e, [slotId]: null }));
        const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
        const filename = currentPath ? currentPath.split("/").pop() : `${prefix}-${Date.now()}.${ext}`;
        const previewUrl = URL.createObjectURL(file);
        setPendingImages((p) => ({ ...p, [slotId]: { file, filename, previewUrl } }));
        onPathChange(`/images/${filename}`);
      },
      onRemove: () => {
        setPendingImages((p) => {
          const next = { ...p };
          delete next[slotId];
          return next;
        });
        setImageErrors((e) => ({ ...e, [slotId]: null }));
        onPathChange(null);
      },
    };
  }

  function requestSave() {
    setMessage(null);
    const { valid, errors } = validateContent(content);
    if (!valid) {
      setValidationErrors(errors.map(humanizeContentError));
      setMessage({ ok: false, text: "Fix the issues below before saving." });
      return;
    }
    setValidationErrors([]);
    setConfirmSaveOpen(true);
  }

  async function doSave() {
    setConfirmSaveOpen(false);
    setSaving(true);
    setMessage(null);

    try {
      // 1) Upload any staged images first, so content.json never references
      // a file that doesn't exist yet in the repo.
      for (const [slotId, entry] of Object.entries(pendingImages)) {
        const dataUrl = await fileToDataUrl(entry.file);
        const res = await fetch("/api/upload-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: entry.filename, dataUrl }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.status === 401) {
          setAuthed(false);
          return;
        }
        if (!res.ok) {
          setMessage({ ok: false, text: `Couldn't upload an image: ${data.error || "please try again."}` });
          setImageErrors((e) => ({ ...e, [slotId]: data.error || "Upload failed" }));
          return;
        }
      }

      // 2) Save the content itself.
      const res = await fetch("/api/save-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, sha }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.status === 401) {
        setAuthed(false);
        return;
      }
      if (res.status === 409) {
        setMessage({
          ok: false,
          text: "Someone else changed the portfolio before you saved. Reload the latest content and reapply your changes.",
        });
        return;
      }
      if (res.status === 422) {
        setValidationErrors((data.details || []).map(humanizeContentError));
        setMessage({ ok: false, text: "The server found some issues — fix them below and save again." });
        return;
      }
      if (!res.ok) {
        setMessage({ ok: false, text: "Couldn't save your changes. Please try again." });
        return;
      }

      setSha(data.sha);
      setSavedSnapshot(JSON.stringify(content));
      setPendingImages({});
      setSavedAt(new Date().toLocaleTimeString());
      setMessage({ ok: true, text: "Saved successfully. Your changes will go live in about a minute." });
    } catch (err) {
      setMessage({ ok: false, text: humanizeCaughtError(err) });
    } finally {
      setSaving(false);
    }
  }

  function discard() {
    loadContent();
  }

  if (checkingSession) {
    return (
      <div className="app admin-page">
        <div className="hero-grid" />
        <p className="admin-loading">Checking session…</p>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="app admin-page">
        <div className="hero-grid" />
        <div className="admin-shell">
          <div className="glass grad-border admin-card admin-card-narrow">
            <p className="admin-kicker">Admin Access</p>
            <h1 className="admin-title grad-text">Portfolio Control</h1>
            <a href="/api/github-login" className="btn btn-solid admin-github-btn">
              <Icon.Github />
              Log in with GitHub
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="app admin-page">
        <div className="hero-grid" />
        <p className="admin-loading">{message ? message.text : "Loading…"}</p>
      </div>
    );
  }

  const sectionProps = {
    overview: { content, savedAt, dirty, onNavigate: setActiveSection },
    profile: {
      profile: content.PROFILE,
      onChange: updateKey("PROFILE"),
      typerWords: content.TYPER_WORDS,
      onTyperWordsChange: updateKey("TYPER_WORDS"),
      slotFor,
    },
    stats: { stats: content.ABOUT_STATS, onChange: updateKey("ABOUT_STATS") },
    experience: { experience: content.EXPERIENCE, onChange: updateKey("EXPERIENCE") },
    skills: {
      skillGroups: content.SKILL_GROUPS,
      onSkillGroupsChange: updateKey("SKILL_GROUPS"),
      techSkills: content.TECH_SKILLS,
      onTechSkillsChange: updateKey("TECH_SKILLS"),
      tools: content.TOOLS,
      onToolsChange: updateKey("TOOLS"),
      aiTools: content.AI_TOOLS,
      onAiToolsChange: updateKey("AI_TOOLS"),
    },
    nft: { collections: content.NFT_COLLECTIONS, onChange: updateKey("NFT_COLLECTIONS"), slotFor },
    achievements: { achievements: content.ACHIEVEMENTS, onChange: updateKey("ACHIEVEMENTS") },
    goals: { goals: content.GOALS, onChange: updateKey("GOALS") },
    threads: { tweets: content.TWEETS, onChange: updateKey("TWEETS"), slotFor },
    socials: { socials: content.SOCIALS, onChange: updateKey("SOCIALS") },
  };

  const Section = {
    overview: OverviewSection,
    profile: ProfileSection,
    stats: AboutStatsSection,
    experience: ExperienceSection,
    skills: SkillsSection,
    nft: NFTSection,
    achievements: AchievementsSection,
    goals: GoalsSection,
    threads: ThreadsSection,
    socials: SocialsSection,
  }[activeSection];

  return (
    <div className="app dashboard">
      <div className={`sidebar-wrap ${mobileNavOpen ? "sidebar-wrap-open" : ""}`}>
        <Sidebar active={activeSection} onSelect={setActiveSection} onClose={() => setMobileNavOpen(false)} />
      </div>
      {mobileNavOpen && <div className="sidebar-scrim" onClick={() => setMobileNavOpen(false)} />}

      <div className="dashboard-main">
        <SaveBar
          dirty={dirty}
          saving={saving || loadingContent}
          savedAt={savedAt}
          onSave={requestSave}
          onDiscard={discard}
          onLogout={logout}
          onMenu={() => setMobileNavOpen(true)}
        />

        <main className="dashboard-content">
          <h2 className="dashboard-heading">{SECTION_TITLES[activeSection]}</h2>

          {message && <div className={`admin-msg ${message.ok ? "admin-msg-ok" : "admin-msg-error"}`}>{message.text}</div>}
          {validationErrors.length > 0 && (
            <ul className="admin-error-list">
              {validationErrors.map((e, i) => (
                <li key={i}>
                  {e.sectionId && e.sectionId !== activeSection ? (
                    <button type="button" className="error-jump" onClick={() => setActiveSection(e.sectionId)}>
                      {e.text} — go to section →
                    </button>
                  ) : (
                    e.text
                  )}
                </li>
              ))}
            </ul>
          )}

          <Section {...sectionProps[activeSection]} />
        </main>
      </div>

      <ConfirmDialog
        open={confirmSaveOpen}
        title="Save & deploy?"
        body="This will update the portfolio source and trigger a new deployment. Changes may take a short time to appear on the live site."
        confirmLabel="Save & Deploy"
        onCancel={() => setConfirmSaveOpen(false)}
        onConfirm={doSave}
      />
    </div>
  );
}
