const { json } = require("../_lib/response");
const { requireSession } = require("../_lib/session");

module.exports = async function handler(req, res) {
  const session = requireSession(req);
  if (!session) {
    return json(res, 401, { error: "Unauthorized" });
  }

  return json(res, 501, {
    ok: false,
    message: "Upload ingestion scaffold not implemented yet.",
    plannedFlow: [
      "receive file or folder manifest",
      "store original file in secure storage",
      "classify source document",
      "extract normalized records",
      "queue human review for low-confidence rows",
      "write approved records into database"
    ]
  });
};
