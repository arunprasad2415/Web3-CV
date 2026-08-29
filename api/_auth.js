import crypto from "node:crypto";

const SESSION_COOKIE = "admin_session";
const STATE_COOKIE = "oauth_state";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours
const STATE_MAX_AGE = 60 * 10; // 10 minutes, just long enough for the GitHub redirect round trip

function sign(value) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) throw new Error("ADMIN_SECRET env var is not set");
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

function readCookie(req, name) {
  const cookies = req.headers.cookie || "";
  const match = cookies.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return match ? match[1] : null;
}

export function makeSessionCookie() {
  const expires = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = `${expires}`;
  const token = `${payload}.${sign(payload)}`;
  return `${SESSION_COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_MAX_AGE}`;
}

export function clearSessionCookie() {
  return `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

export function isAuthed(req) {
  try {
    const value = readCookie(req, SESSION_COOKIE);
    if (!value) return false;
    const [expires, sig] = value.split(".");
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

// Short-lived cookie holding the OAuth "state" value, so the callback can
// confirm the redirect back from GitHub belongs to a login this server
// actually started (CSRF protection for the OAuth flow). SameSite=Lax
// (not Strict) because this cookie must survive GitHub's top-level
// redirect back to our callback URL.
export function makeStateCookie(state) {
  return `${STATE_COOKIE}=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${STATE_MAX_AGE}`;
}

export function clearStateCookie() {
  return `${STATE_COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}

export function readStateCookie(req) {
  return readCookie(req, STATE_COOKIE);
}
