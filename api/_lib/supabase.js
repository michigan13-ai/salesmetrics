const { supabase, flags } = require("./env");

function ensureSupabaseAdmin() {
  if (!flags.supabaseAdminConfigured) {
    throw new Error("Supabase admin is not configured");
  }
}

function headers(extra = {}) {
  return {
    apikey: supabase.serviceRoleKey,
    Authorization: `Bearer ${supabase.serviceRoleKey}`,
    "Content-Type": "application/json",
    ...extra
  };
}

async function select(table, query = "") {
  ensureSupabaseAdmin();
  const suffix = query ? `?${query}` : "";
  const response = await fetch(`${supabase.url}/rest/v1/${table}${suffix}`, {
    headers: headers()
  });

  if (!response.ok) {
    throw new Error(`Supabase select failed: ${response.status}`);
  }

  return response.json();
}

async function insert(table, payload, options = {}) {
  ensureSupabaseAdmin();
  const response = await fetch(`${supabase.url}/rest/v1/${table}`, {
    method: "POST",
    headers: headers({
      Prefer: options.returnMinimal ? "return=minimal" : "return=representation"
    }),
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Supabase insert failed: ${response.status}`);
  }

  if (options.returnMinimal) {
    return null;
  }

  return response.json();
}

async function patch(table, matchQuery, payload) {
  ensureSupabaseAdmin();
  const response = await fetch(`${supabase.url}/rest/v1/${table}?${matchQuery}`, {
    method: "PATCH",
    headers: headers({
      Prefer: "return=representation"
    }),
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Supabase patch failed: ${response.status}`);
  }

  return response.json();
}

async function remove(table, matchQuery) {
  ensureSupabaseAdmin();
  const response = await fetch(`${supabase.url}/rest/v1/${table}?${matchQuery}`, {
    method: "DELETE",
    headers: headers({
      Prefer: "return=representation"
    })
  });

  if (!response.ok) {
    throw new Error(`Supabase delete failed: ${response.status}`);
  }

  return response.json();
}

module.exports = {
  ensureSupabaseAdmin,
  insert,
  patch,
  remove,
  select
};
