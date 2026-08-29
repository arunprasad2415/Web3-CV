import { useMemo, useState } from "react";
import { validateContent } from "../lib/validateContent.js";

const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0b0d12",
    color: "#eaeaea",
    fontFamily: "system-ui, sans-serif",
    padding: "2rem",
  },
  card: {
    maxWidth: 720,
    margin: "0 auto",
    background: "#151822",
    border: "1px solid #2a2f3d",
    borderRadius: 12,
    padding: "2rem",
  },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  input: {
    width: "100%",
    padding: "0.6rem 0.8rem",
    borderRadius: 8,
    border: "1px solid #2a2f3d",
    background: "#0b0d12",
    color: "#eaeaea",
    marginBottom: "0.75rem",
    fontSize: 14,
  },
  textarea: {
    width: "100%",
    minHeight: 480,
    padding: "0.8rem",
    borderRadius: 8,
    border: "1px solid #2a2f3d",
    background: "#0b0d12",
    color: "#eaeaea",
    fontFamily: "ui-monospace, monospace",
    fontSize: 13,
    lineHeight: 1.5,
  },
  button: {
    padding: "0.6rem 1.2rem",
    borderRadius: 8,
    border: "none",
    background: "#6d5efc",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 14,
  },
  buttonSecondary: {
    padding: "0.5rem 1rem",
    borderRadius: 8,
    border: "1px solid #2a2f3d",
    background: "transparent",
    color: "#eaeaea",
    cursor: "pointer",
    fontSize: 13,
  },
  buttonDisabled: { opacity: 0.5, cursor: "not-allowed" },
  msg: (ok) => ({
    marginTop: "0.75rem",
    color: ok ? "#7ee787" : "#ff7b7b",
    fontSize: 14,
    whiteSpace: "pre-wrap",
  }),
  errorList: {
    marginTop: "0.75rem",
    color: "#ff7b7b",
    fontSize: 13,
    background: "#2a1418",
    border: "1px solid #4a1f26",
    borderRadius: 8,
    padding: "0.75rem 1rem",
  },
  label: { display: "block", marginBottom: 6, fontSize: 13, color: "#9aa1b3" },
  section: { marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid #2a2f3d" },
};

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
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

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

  async function login(e) {
    e.preventDefault();
    setLoginError("");
    setLoggingIn(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setLoginError(data.error || "Wrong password.");
        return;
      }
      setPassword("");
      setAuthed(true);
      loadContent();
    } catch {
      setLoginError("Network error — could not reach the server.");
    } finally {
      setLoggingIn(false);
    }
  }

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

  if (!authed) {
    return (
      <div style={styles.page}>
        <div style={{ ...styles.card, maxWidth: 380, marginTop: "10vh" }}>
          <h2 style={{ marginTop: 0 }}>Admin Login</h2>
          <form onSubmit={login}>
            <input
              style={styles.input}
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              disabled={loggingIn}
            />
            <button
              style={{ ...styles.button, ...(loggingIn ? styles.buttonDisabled : {}) }}
              type="submit"
              disabled={loggingIn}
            >
              {loggingIn ? "Logging in..." : "Log in"}
            </button>
          </form>
          {loginError && <div style={styles.msg(false)}>{loginError}</div>}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.headerRow}>
          <h2 style={{ marginTop: 0 }}>Portfolio Content Editor</h2>
          <button style={styles.buttonSecondary} onClick={logout}>
            Log out
          </button>
        </div>
        <p style={{ color: "#9aa1b3", fontSize: 14 }}>
          Edit the JSON below (all portfolio text, links, stats, experience, etc.), then Save.
          Saving commits directly to GitHub and Vercel auto-redeploys the live site.
        </p>

        <textarea
          style={styles.textarea}
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          spellCheck={false}
          disabled={loadingContent}
        />
        {parsed.error && <div style={styles.msg(false)}>Invalid JSON: {parsed.error}</div>}

        <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem" }}>
          <button
            style={{ ...styles.button, ...(busy ? styles.buttonDisabled : {}) }}
            onClick={save}
            disabled={busy}
          >
            {saving ? "Saving..." : "Save & Deploy"}
          </button>
          <button
            style={{ ...styles.buttonSecondary, ...(busy ? styles.buttonDisabled : {}) }}
            onClick={loadContent}
            disabled={busy}
          >
            {loadingContent ? "Reloading..." : "Reload"}
          </button>
        </div>

        {message && <div style={styles.msg(message.ok)}>{message.text}</div>}
        {validationErrors.length > 0 && (
          <ul style={styles.errorList}>
            {validationErrors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        )}

        <div style={styles.section}>
          <h3>Replace an image</h3>
          <p style={{ color: "#9aa1b3", fontSize: 14 }}>
            Pick which image to overwrite, then choose a file (max {MAX_IMAGE_BYTES / 1024 / 1024}MB).
            The existing path in the JSON above keeps working — the file behind it is replaced in
            place.
          </p>
          <label style={styles.label}>Image slot</label>
          <select
            style={styles.input}
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
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => uploadImage(e.target.files[0])}
            disabled={uploading || !uploadPath}
          />
          {uploading && <p style={{ color: "#9aa1b3", fontSize: 13 }}>Uploading...</p>}
          <p style={{ color: "#666", fontSize: 12, marginTop: "0.75rem" }}>
            To add a brand-new image (e.g. a new NFT card), add its entry in the JSON with a new
            path like <code>/images/new-card.jpg</code>, save, then come back here, pick that
            path from the list and upload the file.
          </p>
        </div>
      </div>
    </div>
  );
}
