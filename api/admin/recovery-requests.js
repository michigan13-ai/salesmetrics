const { json } = require("../_lib/response");
const { requireSession } = require("../_lib/session");
const { flags } = require("../_lib/env");
const { patch } = require("../_lib/supabase");

module.exports = async function handler(req, res) {
  const session = requireSession(req);
  if (!session || session.role !== "admin") {
    return json(res, 403, { error: "Admin access required" });
  }

  if (!flags.supabaseAdminConfigured) {
    return json(res, 500, {
      error: "Recovery management is not configured",
      hint: "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, then run the schema in supabase/schema.sql"
    });
  }

  if (req.method !== "PATCH") {
    return json(res, 405, { error: "Method not allowed" });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  if (!body.id) {
    return json(res, 400, { error: "Recovery request id is required" });
  }

  const rows = await patch("access_recovery_requests", `id=eq.${encodeURIComponent(body.id)}`, {
    status: body.status || "resolved",
    resolved_at: new Date().toISOString(),
    resolved_by: session.username
  });

  return json(res, 200, { ok: true, request: rows?.[0] || null });
};
