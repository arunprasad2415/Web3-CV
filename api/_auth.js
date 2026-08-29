import crypto from "node:crypto";

const COOKIE_NAME = "admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

function sign(value) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) throw new Error("ADMIN_SECRET env var is not set");
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

export function makeSessionCookie() {
  const expires = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = `${expires}`;
  const token = `${payload}.${sign(payload)}`;
  return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${MAX_AGE_SECONDS}`;
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

export function isAuthed(req) {
  try {
    const cookies = req.headers.cookie || "";
    const match = cookies.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
    if (!match) return false;
    const [expires, sig] = match[1].split(".");
    if (!expires || !sig || !/^\d+$/.test(expires)) return false;
    if (Number(expires) < Date.now()) return false;
    const expected = sign(expires);
    if (sig.length !== expected.length) return false;
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    // Fail closed (e.g. ADMIN_SECRET missing/misconfigured) rather than 500.
    return false;
  }
}

export function requireAuth(req, res) {
  if (!isAuthed(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

// Best-effort login throttling: an in-memory counter per IP, scoped to a
// single warm serverless instance (ponytail: not shared across instances or
// cold starts — a real distributed limiter needs a KV store, add one if
// brute-force attempts become an observed problem).
const attempts = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;

export function isRateLimited(req) {
  const ip = (req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown")
    .toString()
    .split(",")[0]
    .trim();
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now - entry.start > WINDOW_MS) {
    attempts.set(ip, { start: now, count: 1 });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export function resetRateLimit(req) {
  const ip = (req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown")
    .toString()
    .split(",")[0]
    .trim();
  attempts.delete(ip);
}
