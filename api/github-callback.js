import { readStateCookie, clearStateCookie, makeSessionCookie } from "./_auth.js";
import { siteUrl } from "./_site.js";

function page(title, body) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title>
<style>body{font-family:system-ui,sans-serif;background:#0b0d12;color:#eaeaea;display:flex;
align-items:center;justify-content:center;min-height:100vh;margin:0}
.card{max-width:420px;padding:2rem;text-align:center}
a{color:#6d5efc}</style></head>
<body><div class="card"><h2>${title}</h2><p>${body}</p><p><a href="/admin">Back to /admin</a></p></div></body></html>`;
}

export default async function handler(req, res) {
  const { code, state } = req.query || {};
  const cookieState = readStateCookie(req);
  res.setHeader("Set-Cookie", clearStateCookie());

  if (!code || !state || !cookieState || state !== cookieState) {
    return res
      .status(400)
      .send(page("Login failed", "The login link expired or was invalid. Please try again."));
  }

  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
  const allowedUser = process.env.ADMIN_GITHUB_USERNAME;
  if (!clientId || !clientSecret || !allowedUser) {
    console.error("GitHub OAuth callback hit but not fully configured");
    return res.status(500).send(page("Not configured", "GitHub OAuth is not set up yet."));
  }

  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: `${siteUrl(req)}/api/github-callback`,
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      throw new Error(tokenData.error_description || "no access_token returned");
    }

    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/vnd.github+json",
      },
    });
    const user = await userRes.json();
    if (!userRes.ok || !user.login) throw new Error("could not fetch GitHub user");

    if (user.login.toLowerCase() !== allowedUser.toLowerCase()) {
      return res
        .status(403)
        .send(
          page(
            "Access denied",
            `This admin panel is restricted to the GitHub account "${allowedUser}". You're logged in as "${user.login}".`
          )
        );
    }

    res.setHeader("Set-Cookie", [clearStateCookie(), makeSessionCookie()]);
    res.writeHead(302, { Location: "/admin" });
    res.end();
  } catch (err) {
    console.error("github-callback failed:", err.message);
    res.status(502).send(page("Login failed", "Could not complete GitHub login. Please try again."));
  }
}
