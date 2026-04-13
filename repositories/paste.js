/**
 * Database access layer for pastes.
 */

const db = require("../lib/db");

const TABLE = "tailwinds";

/**
 * Finds a single paste row by its unique key.
 */
const findByKey = (key) => db(TABLE).where("key", key).first();

/**
 * Inserts a new paste row and returns the generated primary key.
 */
const insert = async (data) => {
  try {
    const [id] = await db(TABLE).insert(data);
    return id;
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      const dupErr = new Error("Duplicate key");
      dupErr.isDuplicateKey = true;
      throw dupErr;
    }
    throw err;
  }
};

/**
 * Deletes a single paste by its primary key.
 */
const deleteById = (id) => db(TABLE).where("id", id).del();

/**
 * Deletes all paste rows whose `expires_at` epoch is in the past.
 */
const deleteExpired = () =>
  db(TABLE).where("expires_at", "<", Date.now()).del();

/**
 * Returns a page of paste rows ordered by creation date descending.
 */
const findAll = (page, perPage) =>
  db(TABLE)
    .orderBy("created_at", "desc")
    .limit(perPage)
    .offset((page - 1) * perPage);

/**
 * Returns the total number of paste rows.
 */
const countAll = async () => {
  const [{ count }] = await db(TABLE).count("id as count");
  return Number(count);
};

module.exports = { findByKey, insert, deleteById, deleteExpired, findAll, countAll };
