const crypto = require("crypto");

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

function verifyPassword(password, stored) {
  if (!stored || !stored.includes(":")) return false;

  const [salt, expected] = stored.split(":");
  const actual = crypto.scryptSync(password, salt, 64).toString("hex");
  const left = Buffer.from(actual, "hex");
  const right = Buffer.from(expected, "hex");

  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

module.exports = {
  hashPassword,
  verifyPassword
};
