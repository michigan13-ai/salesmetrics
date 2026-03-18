const { json } = require("../_lib/response");
const { setSession } = require("../_lib/session");
const { validateCredentials } = require("../_lib/auth");
const { flags } = require("../_lib/env");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, { error: "Method not allowed" });
  }

  if (!flags.authConfigured) {
    return json(res, 500, {
      error: "Auth not configured",
      hint: "Set APP_ADMIN_USERNAME, APP_ADMIN_PASSWORD, and APP_SESSION_SECRET"
    });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};

  if (!validateCredentials(body.username || "", body.password || "")) {
    return json(res, 401, { error: "Invalid username or password" });
  }

  setSession(res, body.username);
  return json(res, 200, { ok: true, username: body.username });
};
