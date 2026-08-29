// Prefer an explicit SITE_URL in production: the redirect_uri sent to
// GitHub must exactly match the callback URL registered on the OAuth App,
// and req.headers.host is attacker-influenceable on a raw HTTP request, so
// it's a fallback for local/dev use only.
export function siteUrl(req) {
  return process.env.SITE_URL || `https://${req.headers.host}`;
}
