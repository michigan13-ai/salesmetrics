const { json } = require("../_lib/response");
const { readSession } = require("../_lib/session");

module.exports = async function handler(req, res) {
  const session = readSession(req);
  if (!session) {
    return json(res, 401, { authenticated: false });
  }

  return json(res, 200, {
    authenticated: true,
    user: {
      username: session.username
    }
  });
};
