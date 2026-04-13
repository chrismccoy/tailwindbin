/**
 * Paste route definitions.
 */

const express = require("express");
const pasteService = require("../services/paste");
const { injectTailwind } = require("../lib/inject");
const { MAX_CONTENT_BYTES, EXPIRY_YEARS } = require("../config");
const { createRateLimiter } = require("../middleware/rateLimit");

const router = express.Router();

const createLimiter = createRateLimiter();

/**
 * CSP for the preview route. Allows external scripts/styles so that
 * users can render CDN libraries (Alpine.js, Font Awesome, Google Fonts, etc.)
 */
const PREVIEW_CSP = [
  "default-src 'none'",
  "script-src * 'unsafe-inline' 'unsafe-eval'",
  "style-src * 'unsafe-inline'",
  "img-src * data: blob:",
  "font-src *",
  "connect-src *",
  "frame-ancestors 'self'",
  "base-uri 'none'",
  "form-action 'none'",
].join("; ");

/**
 * Resolves a paste by key once for all /tailwind/:key sub-routes.
 */
router.param("key", async (req, _res, next, key) => {
  req.paste = await pasteService.findByKey(key);
  next();
});

/**
 * Renders the upload / paste creation form.
 */
router.get("/", (_req, res) => {
  res.render("new", {
    maxBytes: MAX_CONTENT_BYTES,
    expiryYears: EXPIRY_YEARS,
  });
});

/**
 * Renders the paste detail page with an embedded iframe preview.
 */
router.get("/tailwind/:key", (req, res) => {
  res.render("show", { paste: req.paste });
});

/**
 * Returns the raw HTML source as plain text.
 */
router.get("/tailwind/:key/raw", (req, res) => {
  res.type("text/plain").send(req.paste.content);
});

/**
 * Serves the full HTML with the Tailwind CDN script injected for a standalone preview.
 */
router.get("/tailwind/:key/preview", (req, res) => {
  res
    .set("Content-Security-Policy", PREVIEW_CSP)
    .type("text/html")
    .send(injectTailwind(req.paste.content));
});

/**
 * Validates and creates a new paste, then redirects to its detail page. Rate-limited.
 */
router.post("/tailwind/create", createLimiter, async (req, res) => {
  const paste = await pasteService.createPaste(req.body.content ?? "");
  res.redirect(`/tailwind/${paste.key}`);
});

module.exports = router;
