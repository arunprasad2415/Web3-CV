const API = "https://api.github.com";

function env() {
  const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH } = process.env;
  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    throw new Error("Missing GITHUB_TOKEN / GITHUB_OWNER / GITHUB_REPO env vars");
  }
  return { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, branch: GITHUB_BRANCH || "main" };
}

function headers(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };
}

// Returns { content: string (utf8), sha } or null if file doesn't exist yet.
export async function getFile(path) {
  const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, branch } = env();
  const res = await fetch(
    `${API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${branch}`,
    { headers: headers(GITHUB_TOKEN) }
  );
  if (res.status === 404) return null;
  if (!res.ok) {
    const err = new Error(`GitHub getFile failed: ${res.status}`);
    err.status = res.status;
    err.detail = await res.text();
    throw err;
  }
  const json = await res.json();
  return { content: Buffer.from(json.content, "base64").toString("utf8"), sha: json.sha };
}

// contentBase64: raw base64 payload (no data: prefix). message: commit message.
// sha: required to update an existing file (omit only when creating a new one).
export async function putFile(path, contentBase64, message, sha) {
  const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, branch } = env();
  const res = await fetch(
    `${API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
    {
      method: "PUT",
      headers: headers(GITHUB_TOKEN),
      body: JSON.stringify({ message, content: contentBase64, sha: sha || undefined, branch }),
    }
  );
  if (!res.ok) {
    const err = new Error(`GitHub putFile failed: ${res.status}`);
    err.status = res.status;
    err.detail = await res.text();
    throw err;
  }
  return res.json();
}
