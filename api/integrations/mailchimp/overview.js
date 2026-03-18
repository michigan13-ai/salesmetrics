const { json } = require("../../_lib/response");
const { mailchimp, flags } = require("../../_lib/env");
const { requireSession } = require("../../_lib/session");

async function fetchMailchimpRoot() {
  const authHeader = mailchimp.oauthAccessToken
    ? `Bearer ${mailchimp.oauthAccessToken}`
    : `apikey ${mailchimp.apiKey}`;

  const response = await fetch(`https://${mailchimp.serverPrefix}.api.mailchimp.com/3.0/`, {
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Mailchimp request failed: ${response.status} ${body}`);
  }

  return response.json();
}

module.exports = async function handler(req, res) {
  const session = requireSession(req);
  if (!session) {
    return json(res, 401, { error: "Unauthorized" });
  }

  if (!flags.mailchimpConfigured) {
    return json(res, 200, {
      configured: false,
      provider: "mailchimp",
      requiredEnv: ["MAILCHIMP_SERVER_PREFIX", "MAILCHIMP_API_KEY or MAILCHIMP_OAUTH_ACCESS_TOKEN"],
      endpointsPlanned: [
        "campaign reports",
        "audience stats",
        "templates",
        "tags / segments",
        "campaign detail history"
      ]
    });
  }

  try {
    const root = await fetchMailchimpRoot();
    return json(res, 200, {
      configured: true,
      provider: "mailchimp",
      accountName: root.account_name,
      loginId: root.login_id,
      apiEndpoint: root._links?.find?.((item) => item.rel === "self")?.href || null,
      note: "This route is a server-only connectivity check. Real sync jobs should normalize Mailchimp data into your database."
    });
  } catch (error) {
    return json(res, 502, {
      configured: true,
      provider: "mailchimp",
      error: error.message
    });
  }
};
