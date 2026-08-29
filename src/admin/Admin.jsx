import { useEffect, useMemo, useState } from "react";
import Reveal from "../components/Reveal.jsx";
import { Icon } from "../components/Icons.jsx";
import { validateContent } from "../lib/validateContent.js";

const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

function extractImagePaths(obj) {
  const paths = new Set();
  if (obj?.PROFILE?.photo) paths.add(obj.PROFILE.photo);
  (obj?.NFT_COLLECTIONS || []).forEach((c) => c?.image && paths.add(c.image));
  (obj?.TWEETS || []).forEach((t) => t?.image && paths.add(t.image));
  return [...paths];
}

// Parses jsonText for display/derived state without ever throwing — invalid
// JSON while mid-edit is expected, it must not crash the whole admin page.
function tryParse(text) {
  try {
    return { value: JSON.parse(text), error: null };
  } catch (err) {
    return { value: null, error: err.message };
  }
}

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const [jsonText, setJsonText] = useState("");
  const [sha, setSha] = useState(null);
  const [message, setMessage] = useState(null); // { ok, text }
  const [validationErrors, setValidationErrors] = useState([]);
  const [loadingContent, setLoadingContent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadPath, setUploadPath] = useState("");

  const busy = loadingContent || saving || uploading;

  const parsed = useMemo(() => tryParse(jsonText || "{}"), [jsonText]);
  const imagePaths = useMemo(() => extractImagePaths(parsed.value), [parsed.value]);

  // Runs once on mount: a GitHub OAuth login lands back here via a full-page
  // redirect (not a fetch), so React state starts fresh and has to ask the
  // server whether the session cookie it already has is valid.
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/content");
        if (res.ok) {
          const data = await res.json();
          setJsonText(JSON.stringify(data.content, null, 2));
          setSha(data.sha);
          setAuthed(true);
        }
      } finally {
        setCheckingSession(false);
      }
    })();
  }, []);

  async function logout() {
    setAuthed(false);
    setJsonText("");
    setSha(null);
    setMessage(null);
    setValidationErrors([]);
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch {
      // Cookie is cleared client-side by the response header regardless;
      // a failed network call here just means the button felt slower.
    }
  }

  async function loadContent() {
    setLoadingContent(true);
    setMessage(null);
    setValidationErrors([]);
    try {
      const res = await fetch("/api/content");
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        setAuthed(false);
        throw new Error("Session expired — please log in again.");
      }
      if (!res.ok) throw new Error(data.error || "Failed to load content");
      setJsonText(JSON.stringify(data.content, null, 2));
      setSha(data.sha);
    } catch (err) {
      setMessage({ ok: false, text: err.message });
    } finally {
      setLoadingContent(false);
    }
  }

  async function save() {
    setMessage(null);
    setValidationErrors([]);

    if (parsed.error) {
      setMessage({ ok: false, text: `Invalid JSON: ${parsed.error}` });
      return;
    }
    const { valid, errors } = validateContent(parsed.value);
    if (!valid) {
      setValidationErrors(errors);
      setMessage({ ok: false, text: "Fix the issues below before saving." });
      return;
    }
    if (!window.confirm("Save and redeploy the live site with these changes?")) return;

    setSaving(true);
    try {
      const res = await fetch("/api/save-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: parsed.value, sha }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        setAuthed(false);
        throw new Error("Session expired — please log in again.");
      }
      if (res.status === 409) {
        throw new Error(`${data.error} Click Reload, then reapply your edits.`);
      }
      if (res.status === 422) {
        setValidationErrors(data.details || []);
        throw new Error(data.error);
      }
      if (!res.ok) throw new Error(data.error || "Save failed");
      setSha(data.sha);
      setMessage({ ok: true, text: "Saved. Vercel will redeploy the site in ~1 minute." });
    } catch (err) {
      setMessage({ ok: false, text: err.message });
    } finally {
      setSaving(false);
    }
  }

  async function uploadImage(file) {
    if (!file || !uploadPath) return;
    setMessage(null);
    if (file.size > MAX_IMAGE_BYTES) {
      setMessage({
        ok: false,
        text: `Image too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max ${MAX_IMAGE_BYTES / 1024 / 1024}MB.`,
      });
      return;
    }
    setUploading(true);
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Could not read the selected file"));
        reader.readAsDataURL(file);
      });
      const filename = uploadPath.split("/").pop();
      const res = await fetch("/api/upload-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename, dataUrl }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        setAuthed(false);
        throw new Error("Session expired — please log in again.");
      }
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setMessage({
        ok: true,
        text: `Uploaded to ${data.path}. Vercel will redeploy in ~1 minute (image may take a little longer to update due to caching).`,
      });
    } catch (err) {
      setMessage({ ok: false, text: err.message });
    } finally {
      setUploading(false);
    }
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
          <Reveal>
            <div className="glass grad-border admin-card admin-card-narrow">
              <p className="admin-kicker">Admin Access</p>
              <h1 className="admin-title grad-text">Portfolio Control</h1>
              <a href="/api/github-login" className="btn btn-solid admin-github-btn">
                <Icon.Github />
                Log in with GitHub
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    );
  }

  return (
    <div className="app admin-page">
      <div className="hero-grid" />
      <div className="admin-shell">
        <Reveal>
          <div className="glass grad-border admin-card">
            <div className="admin-header">
              <div>
                <p className="admin-kicker">Admin Access</p>
                <h1 className="admin-title grad-text">Content Editor</h1>
              </div>
              <button className="btn btn-ghost" onClick={logout}>
                Log out
              </button>
            </div>
            <p className="admin-sub">
              Edit the JSON below — all portfolio text, links, stats, and experience. Saving
              commits straight to GitHub and Vercel redeploys the live site automatically.
            </p>

            <textarea
              className="admin-textarea"
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              spellCheck={false}
              disabled={loadingContent}
            />
            {parsed.error && (
              <div className="admin-msg admin-msg-error">Invalid JSON: {parsed.error}</div>
            )}

            <div className="admin-actions">
              <button
                className={`btn btn-solid ${busy ? "btn-disabled" : ""}`}
                onClick={save}
                disabled={busy}
              >
                {saving ? "Saving…" : "Save & Deploy"}
              </button>
              <button
                className={`btn btn-ghost ${busy ? "btn-disabled" : ""}`}
                onClick={loadContent}
                disabled={busy}
              >
                {loadingContent ? "Reloading…" : "Reload"}
              </button>
            </div>

            {message && (
              <div className={`admin-msg ${message.ok ? "admin-msg-ok" : "admin-msg-error"}`}>
                {message.text}
              </div>
            )}
            {validationErrors.length > 0 && (
              <ul className="admin-error-list">
                {validationErrors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            )}

            <div className="admin-section">
              <h3>Replace an image</h3>
              <p className="admin-sub">
                Pick which image to overwrite, then choose a file (max{" "}
                {MAX_IMAGE_BYTES / 1024 / 1024}MB). The existing path in the JSON above keeps
                working — the file behind it is replaced in place.
              </p>
              <select
                className="admin-select"
                value={uploadPath}
                onChange={(e) => setUploadPath(e.target.value)}
                disabled={uploading}
              >
                {imagePaths.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <input
                className="admin-file"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(e) => uploadImage(e.target.files[0])}
                disabled={uploading || !uploadPath}
              />
              {uploading && <p className="admin-loading">Uploading…</p>}
              <p className="admin-hint">
                To add a brand-new image (e.g. a new NFT card), add its entry in the JSON with a
                new path like <code>/images/new-card.jpg</code>, save, then come back here, pick
                that path from the list and upload the file.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
