/**
 * Cryptographic utilities.
 */

const crypto = require("crypto");

// Random key used for HMAC normalization.
const HMAC_KEY = crypto.randomBytes(32);

/**
 * Constant-time string comparison using HMAC normalization.
 */
const timingSafeStringEqual = (a, b) => {
  const hashA = crypto.createHmac("sha256", HMAC_KEY).update(String(a)).digest();
  const hashB = crypto.createHmac("sha256", HMAC_KEY).update(String(b)).digest();
  return crypto.timingSafeEqual(hashA, hashB);
};

module.exports = { timingSafeStringEqual };
