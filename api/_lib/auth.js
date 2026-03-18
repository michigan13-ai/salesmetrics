const crypto = require("crypto");
const { app, flags } = require("./env");

function safeCompare(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function validateCredentials(username, password) {
  if (!flags.authConfigured) {
    return false;
  }

  return safeCompare(username, app.username) && safeCompare(password, app.password);
}

module.exports = { validateCredentials };
