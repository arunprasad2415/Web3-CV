import { requireAuth } from "./_auth.js";
import { putFile } from "./_github.js";
import { validateContent } from "../src/lib/validateContent.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  if (!requireAuth(req, res)) return;

  const { content, sha } = req.body || {};
  if (!content || typeof content !== "object" || Array.isArray(content)) {
    return res.status(400).json({ error: "Missing content object" });
  }
  if (!sha) {
    return res.status(400).json({
      error: "Missing sha — reload the editor to get the latest version before saving",
    });
  }

  const { valid, errors } = validateContent(content);
  if (!valid) {
    return res.status(422).json({ error: "Content failed validation", details: errors });
  }

  try {
    const json = JSON.stringify(content, null, 2) + "\n";
    const base64 = Buffer.from(json, "utf8").toString("base64");
    const result = await putFile(
      "src/data/content.json",
      base64,
      "Update site content via admin panel",
      sha
    );
    res.status(200).json({ ok: true, sha: result.content.sha });
  } catch (err) {
    console.error("save-content failed:", err.status, err.detail || err.message);
    if (err.status === 409) {
      return res.status(409).json({
        error: "Content changed since you loaded it. Reload and reapply your edits.",
      });
    }
    res.status(502).json({ error: "Could not save content. Please try again." });
  }
}
