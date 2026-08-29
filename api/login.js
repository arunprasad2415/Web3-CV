import crypto from "node:crypto";
import { makeSessionCookie, isRateLimited, resetRateLimit } from "./_auth.js";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  if (isRateLimited(req)) {
    return res.status(429).json({ error: "Too many attempts. Try again later." });
  }

  const expected = process.env.ADMIN_PASSWORD;
  const secretConfigured = Boolean(process.env.ADMIN_SECRET);
  if (!expected || !secretConfigured) {
    console.error("Admin login attempted but ADMIN_PASSWORD/ADMIN_SECRET are not configured");
    return res.status(500).json({ error: "Admin login is not configured" });
  }

  const { password } = req.body || {};
  const given = Buffer.from(String(password || ""));
  const want = Buffer.from(expected);
  const ok = given.length === want.length && crypto.timingSafeEqual(given, want);

  if (!ok) return res.status(401).json({ error: "Wrong password" });

  resetRateLimit(req);
  res.setHeader("Set-Cookie", makeSessionCookie());
  res.status(200).json({ ok: true });
}
