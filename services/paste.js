/**
 * Paste service.
 */

const Paste = require("../models/paste");
const repo = require("../repositories/paste");
const { generateKey } = require("../lib/keygen");
const { NotFoundError, ValidationError } = require("../lib/errors");
const { EXPIRY_MS, MAX_CONTENT_BYTES } = require("../config");

/**
 * Maximum number of insert attempts before giving up on key uniqueness.
 */
const MAX_KEY_ATTEMPTS = 5;

/**
 * Default number of pastes per page for listPastes.
 */
const PASTES_PER_PAGE = 20;

/**
 * Looks up a paste by its unique key and returns a Paste object.
 */
const findByKey = async (key) => {
  const row = await repo.findByKey(key);
  if (!row) throw new NotFoundError("Paste not found");

  const paste = new Paste(row);

  if (paste.isExpired) {
    await repo.deleteById(paste.id);
    throw new NotFoundError("Paste has expired");
  }

  return paste;
};

/**
 * Validates, creates, and returns a new paste.
 */
const createPaste = async (rawContent) => {
  const content = (rawContent ?? "").trim();

  if (!content) {
    throw new ValidationError("Content must not be empty");
  }

  if (Buffer.byteLength(content, "utf8") > MAX_CONTENT_BYTES) {
    throw new ValidationError(
      `Content exceeds maximum size of ${MAX_CONTENT_BYTES / 1000} KB`
    );
  }

  const expires_at = Date.now() + EXPIRY_MS;

  let lastError;
  for (let i = 0; i < MAX_KEY_ATTEMPTS; i++) {
    const key = generateKey();
    try {
      const id = await repo.insert({ key, content, expires_at });
      return new Paste({ id, key, content, expires_at });
    } catch (err) {
      if (err.isDuplicateKey) {
        lastError = err;
        continue;
      }
      throw err;
    }
  }

  throw new Error(
    `Failed to generate unique key after ${MAX_KEY_ATTEMPTS} attempts: ${lastError?.message}`
  );
};

/**
 * Deletes all expired pastes from the database.
 */
const deleteExpired = () => repo.deleteExpired();

/**
 * Returns a paginated list of all pastes (including expired ones).
 */
const listPastes = async (page = 1, perPage = PASTES_PER_PAGE) => {
  const [rows, total] = await Promise.all([
    repo.findAll(page, perPage),
    repo.countAll(),
  ]);
  const pastes = rows.map((row) => new Paste(row));
  return {
    pastes,
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
  };
};

/**
 * Deletes a paste by its numeric ID.
 */
const deletePaste = (id) => repo.deleteById(id);

module.exports = { findByKey, createPaste, deleteExpired, listPastes, deletePaste };
