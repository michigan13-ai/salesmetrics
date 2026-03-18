const { json } = require("../_lib/response");
const { requireSession } = require("../_lib/session");
const { flags } = require("../_lib/env");
const { insert, patch, remove } = require("../_lib/supabase");
const { hashPassword } = require("../_lib/passwords");

module.exports = async function handler(req, res) {
  const session = requireSession(req);
  if (!session || session.role !== "admin") {
    return json(res, 403, { error: "Admin access required" });
  }

  if (!flags.supabaseAdminConfigured) {
    return json(res, 500, {
      error: "User management is not configured",
      hint: "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, then run the schema in supabase/schema.sql"
    });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};

  if (req.method === "POST") {
    if (!body.username || !body.password) {
      return json(res, 400, { error: "Username and password are required" });
    }

    const rows = await insert("dashboard_users", [
      {
        username: body.username,
        password_hash: hashPassword(body.password),
        role: body.role || "viewer",
        is_active: true
      }
    ]);

    return json(res, 200, { ok: true, user: rows?.[0] || null });
  }

  if (req.method === "PATCH") {
    if (!body.id) {
      return json(res, 400, { error: "User id is required" });
    }

    const updates = {};
    if (body.username) updates.username = body.username;
    if (body.password) updates.password_hash = hashPassword(body.password);
    if (body.role) updates.role = body.role;
    if (typeof body.is_active === "boolean") updates.is_active = body.is_active;

    const rows = await patch("dashboard_users", `id=eq.${encodeURIComponent(body.id)}`, updates);
    return json(res, 200, { ok: true, user: rows?.[0] || null });
  }

  if (req.method === "DELETE") {
    const id = req.query?.id || body.id;
    if (!id) {
      return json(res, 400, { error: "User id is required" });
    }

    await remove("dashboard_users", `id=eq.${encodeURIComponent(id)}`);
    return json(res, 200, { ok: true });
  }

  return json(res, 405, { error: "Method not allowed" });
};
