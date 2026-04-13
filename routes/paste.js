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

router.param("key", async (req, _res, next, key) => {
  req.paste = await pasteService.findByKey(key);
  next();
});

router.get("/", (_req, res) => {
  res.render("new", {
    maxBytes: MAX_CONTENT_BYTES,
    expiryYears: EXPIRY_YEARS,
  });
});

router.get("/tailwind/:key", (req, res) => {
  res.render("show", { paste: req.paste });
});

router.get("/tailwind/:key/raw", (req, res) => {
  res.type("text/plain").send(req.paste.content);
});

router.get("/tailwind/:key/preview", (req, res) => {
  res
    .set("Content-Security-Policy", PREVIEW_CSP)
    .type("text/html")
    .send(injectTailwind(req.paste.content));
});

router.post("/tailwind/create", createLimiter, async (req, res) => {
  const paste = await pasteService.createPaste(req.body.content ?? "");
  res.redirect(`/tailwind/${paste.key}`);
});

module.exports = router;
