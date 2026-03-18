const { json } = require("../../_lib/response");
const { streamline, flags } = require("../../_lib/env");
const { requireSession } = require("../../_lib/session");

module.exports = async function handler(req, res) {
  const session = requireSession(req);
  if (!session) {
    return json(res, 401, { error: "Unauthorized" });
  }

  if (!flags.streamlineConfigured) {
    return json(res, 200, {
      configured: false,
      provider: "streamline",
      requiredEnv: ["STREAMLINE_API_BASE_URL", "STREAMLINE_API_KEY", "STREAMLINE_ACCOUNT_ID"],
      endpointsPlanned: [
        "reservations",
        "occupancy",
        "owner stays",
        "lot / site availability",
        "guest profiles"
      ],
      note:
        "Official public Streamline API docs were not found in this session. The client scaffold is intentionally generic until you provide endpoint docs or sample requests."
    });
  }

  return json(res, 200, {
    configured: true,
    provider: "streamline",
    baseUrl: streamline.baseUrl,
    accountId: streamline.accountId || null,
    note:
      "Integration scaffold is ready. Next step is wiring the exact authenticated endpoints once Streamline API docs or endpoint details are available."
  });
};
