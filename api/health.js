const { json } = require("./_lib/response");
const { flags } = require("./_lib/env");

module.exports = async function handler(req, res) {
  json(res, 200, {
    ok: true,
    app: "Hearthside Grove Motorcoach Resort",
    services: {
      authConfigured: flags.authConfigured,
      mailchimpConfigured: flags.mailchimpConfigured,
      streamlineConfigured: flags.streamlineConfigured
    }
  });
};
