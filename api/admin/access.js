const { json } = require("../_lib/response");
const { requireSession } = require("../_lib/session");
const { flags, app } = require("../_lib/env");
const { select } = require("../_lib/supabase");

module.exports = async function handler(req, res) {
  const session = requireSession(req);
  if (!session || session.role !== "admin") {
    return json(res, 403, { error: "Admin access required" });
  }

  if (!flags.supabaseAdminConfigured) {
    return json(res, 200, {
      configured: false,
      adminUser: app.username,
      users: [],
      recoveryRequests: []
    });
  }

  const [users, recoveryRequests] = await Promise.all([
    select("dashboard_users", "select=id,username,role,is_active,created_at&order=created_at.desc"),
    select("access_recovery_requests", "select=id,requester_name,requester_contact,request_type,note,status,created_at&order=created_at.desc")
  ]);

  return json(res, 200, {
    configured: true,
    adminUser: app.username,
    users,
    recoveryRequests
  });
};
