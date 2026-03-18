const crypto = require("crypto");
const { app } = require("./env");

const COOKIE_NAME = "hgmr_session";
const ONE_DAY_SECONDS = 60 * 60 * 24;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

function base64url(value) {
  return Buffer.from(value).toString("base64url");
}

function sign(value) {
  return crypto.createHmac("sha256", app.sessionSecret).update(value).digest("base64url");
}

function timingSafeEqual(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function createSessionValue(user) {
  const payload = JSON.stringify({
    username: user.username,
    role: user.role || "viewer",
    exp: Math.floor(Date.now() / 1000) + ONE_DAY_SECONDS
  });
  const encoded = base64url(payload);
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
}

function parseCookies(req) {
  const raw = req.headers.cookie || "";
  return raw.split(";").reduce((acc, item) => {
    const [key, ...rest] = item.trim().split("=");
    if (!key) return acc;
    acc[key] = rest.join("=");
    return acc;
  }, {});
}

function readSession(req) {
  const cookies = parseCookies(req);
  const raw = cookies[COOKIE_NAME];
  if (!raw) return null;

  const [encoded, signature] = raw.split(".");
  if (!encoded || !signature) return null;
  if (!timingSafeEqual(sign(encoded), signature)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

function setSession(res, user) {
  const value = createSessionValue(user);
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=${value}; HttpOnly; Path=/; Max-Age=${ONE_DAY_SECONDS}; SameSite=Strict${IS_PRODUCTION ? "; Secure" : ""}`
  );
}

function clearSession(res) {
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict${IS_PRODUCTION ? "; Secure" : ""}`
  );
}

function requireSession(req) {
  return readSession(req);
}

module.exports = {
  clearSession,
  requireSession,
  setSession,
  readSession
};
