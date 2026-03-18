const { json } = require("../_lib/response");
const { flags } = require("../_lib/env");
const { insert } = require("../_lib/supabase");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, { error: "Method not allowed" });
  }

  if (!flags.supabaseAdminConfigured) {
    return json(res, 500, {
      error: "Recovery requests are not configured",
      hint: "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, then run the schema in supabase/schema.sql"
    });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const requestType = Array.isArray(body.requestType) ? body.requestType.join(", ") : String(body.requestType || "");

  if (!body.name || !requestType) {
    return json(res, 400, { error: "Name and request type are required" });
  }

  const rows = await insert("access_recovery_requests", [
    {
      requester_name: body.name,
      requester_contact: body.contact || null,
      request_type: requestType,
      note: body.note || null,
      status: "open"
    }
  ]);

  return json(res, 200, { ok: true, request: rows?.[0] || null });
};
