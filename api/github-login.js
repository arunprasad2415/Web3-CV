import crypto from "node:crypto";
import { makeStateCookie } from "./_auth.js";
import { siteUrl } from "./_site.js";

export default function handler(req, res) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  if (!clientId) {
    return res.status(500).send("GitHub OAuth is not configured (missing GITHUB_OAUTH_CLIENT_ID).");
  }

  const state = crypto.randomBytes(24).toString("hex");
  const redirectUri = `${siteUrl(req)}/api/github-callback`;

  const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("scope", "read:user");
  authorizeUrl.searchParams.set("state", state);
  authorizeUrl.searchParams.set("allow_signup", "false");

  res.setHeader("Set-Cookie", makeStateCookie(state));
  res.writeHead(302, { Location: authorizeUrl.toString() });
  res.end();
}
