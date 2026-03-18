const crypto = require("crypto");
const { app, flags } = require("./env");
const { select } = require("./supabase");
const { verifyPassword } = require("./passwords");

function safeCompare(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

async function validateCredentials(username, password) {
  if (!flags.authConfigured) {
    return null;
  }

  if (safeCompare(username, app.username) && safeCompare(password, app.password)) {
    return {
      username,
      role: "admin",
      source: "env"
    };
  }

  if (!flags.supabaseAdminConfigured) {
    return null;
  }

  const rows = await select("dashboard_users", `select=id,username,password_hash,role,is_active&username=eq.${encodeURIComponent(username)}&limit=1`);
  const user = rows[0];

  if (!user || !user.is_active) {
    return null;
  }

  if (!verifyPassword(password, user.password_hash)) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    role: user.role || "viewer",
    source: "supabase"
  };
}

module.exports = { validateCredentials };
