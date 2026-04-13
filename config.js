/**
 * Application configuration.
 */

require("dotenv").config();

// Number of seconds in one day.
const DAY_IN_SECONDS = 86_400;

// Number of seconds in one year (365 days).
const YEAR_IN_SECONDS = 365 * DAY_IN_SECONDS;

const EXPIRY_YEARS = 1;
const EXPIRY_MS = YEAR_IN_SECONDS * EXPIRY_YEARS * 1000;

/**
 * Parses and validates an environment variable as a positive integer.
 */
const requirePositiveInt = (name, fallback) => {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;

  const parsed = Number(raw);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(
      `Invalid configuration: ${name}="${raw}" must be a positive integer`
    );
  }
  return parsed;
};

/**
 * Parses and validates an environment variable as a non-empty string with a fallback.
 */
const requireString = (name, fallback) => {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;

  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error(
      `Invalid configuration: ${name} must be a non-empty string`
    );
  }
  return trimmed;
};

/**
 * Reads a required environment variable, throwing if it is absent or blank.
 */
const requireEnvString = (name, hint = "") => {
  const s = process.env[name]?.trim();
  if (!s) {
    const extra = hint ? ` ${hint}` : "";
    throw new Error(
      `${name} must be set in your environment (e.g. in .env).${extra}`
    );
  }
  return s;
};

const PORT = requirePositiveInt("PORT", 3000);
const BIND_IP = requireString("IP_ADDRESS", "127.0.0.1");

const SECRET_HINT =
  `Generate one with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`;

module.exports = Object.freeze({
  PORT,
  BIND_IP,

  IS_PRODUCTION: process.env.NODE_ENV === "production",

  MAX_CONTENT_BYTES: 100_000,
  CLEANUP_INTERVAL_MS: 60 * 60 * 1000,
  GRACEFUL_SHUTDOWN_MS: 5_000,

  KEY_LENGTH: 8,
  KEY_ALPHABET:
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",

  EXPIRY_YEARS,
  EXPIRY_MS,

  DAY_IN_SECONDS,
  YEAR_IN_SECONDS,

  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000,
  RATE_LIMIT_MAX: 20,

  CSRF_SECRET: requireEnvString("CSRF_SECRET", SECRET_HINT),
  CSRF_COOKIE_NAME: "__csrf",

  ADMIN_USERNAME: requireEnvString("ADMIN_USERNAME"),
  ADMIN_PASSWORD: requireEnvString("ADMIN_PASSWORD"),

  SESSION_SECRET: requireEnvString("SESSION_SECRET", SECRET_HINT),

  TAILWIND_CDN_URL: "https://cdn.tailwindcss.com",
});
