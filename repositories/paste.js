/**
 * Database access layer for pastes.
 */

const db = require("../lib/db");

const TABLE = "tailwinds";

const findByKey = (key) => db(TABLE).where("key", key).first();

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

const deleteById = (id) => db(TABLE).where("id", id).del();

const deleteExpired = () =>
  db(TABLE).where("expires_at", "<", Date.now()).del();

const findAll = (page, perPage) =>
  db(TABLE)
    .orderBy("created_at", "desc")
    .limit(perPage)
    .offset((page - 1) * perPage);

const countAll = async () => {
  const [{ count }] = await db(TABLE).count("id as count");
  return Number(count);
};

module.exports = { findByKey, insert, deleteById, deleteExpired, findAll, countAll };
