import { requireAuth } from "./_auth.js";
import { getFile } from "./_github.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  if (!requireAuth(req, res)) return;

  try {
    const file = await getFile("src/data/content.json");
    if (!file) return res.status(404).json({ error: "content.json not found in repo" });
    res.status(200).json({ content: JSON.parse(file.content), sha: file.sha });
  } catch (err) {
    console.error("content fetch failed:", err.status, err.detail || err.message);
    res.status(502).json({ error: "Could not load content from GitHub. Please try again." });
  }
}
