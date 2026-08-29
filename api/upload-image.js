import { requireAuth } from "./_auth.js";
import { getFile, putFile } from "./_github.js";

// Extension -> allowed MIME types (rejects e.g. an .svg renamed to .jpg).
const ALLOWED = {
  jpg: ["image/jpeg"],
  jpeg: ["image/jpeg"],
  png: ["image/png"],
  webp: ["image/webp"],
  gif: ["image/gif"],
};

// Vercel serverless functions cap the request body around 4.5MB; base64
// adds ~33% overhead, so keep well under that with headroom for JSON framing.
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

// No "/" or ".." — filename must stay a single path segment inside
// public/images/, and must resolve to one of the existing image slots.
const SAFE_FILENAME = /^[A-Za-z0-9][A-Za-z0-9._-]{0,99}$/;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  if (!requireAuth(req, res)) return;

  const { filename, dataUrl } = req.body || {};
  const name = String(filename || "");
  const ext = name.includes(".") ? name.split(".").pop().toLowerCase() : "";

  if (!SAFE_FILENAME.test(name) || name.includes("..") || !ALLOWED[ext]) {
    return res.status(400).json({ error: "Invalid filename or unsupported image type" });
  }

  const match = /^data:([\w+.-]+\/[\w+.-]+);base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl || "");
  if (!match) return res.status(400).json({ error: "Invalid image data" });
  const [, mime, base64] = match;
  if (!ALLOWED[ext].includes(mime)) {
    return res.status(400).json({ error: `File content (${mime}) doesn't match .${ext}` });
  }

  const approxBytes = Math.floor((base64.length * 3) / 4);
  if (approxBytes > MAX_IMAGE_BYTES) {
    return res.status(413).json({
      error: `Image too large (${(approxBytes / 1024 / 1024).toFixed(1)}MB). Max ${MAX_IMAGE_BYTES / 1024 / 1024}MB.`,
    });
  }

  try {
    // public/images/ is a flat directory with no user-controlled subpaths
    // (SAFE_FILENAME forbids "/" and ".."), so this can only ever create or
    // replace a file directly inside it — nothing else in the repo is
    // reachable through this endpoint.
    const path = `public/images/${name}`;
    const existing = await getFile(path);
    await putFile(path, base64, `Update image ${name} via admin panel`, existing?.sha);
    res.status(200).json({ ok: true, path: `/images/${name}` });
  } catch (err) {
    console.error("upload-image failed:", err.status, err.detail || err.message);
    if (err.status === 409) {
      return res.status(409).json({ error: "Image changed concurrently. Try uploading again." });
    }
    res.status(502).json({ error: "Could not upload image. Please try again." });
  }
}
