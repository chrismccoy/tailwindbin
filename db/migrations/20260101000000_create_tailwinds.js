/**
 * Initial migration — creates the tailwinds table.
 */

exports.up = async (knex) => {
  await knex.schema.createTable("tailwinds", (t) => {
    t.increments("id").primary();
    t.string("key").notNullable().unique();
    t.text("content").notNullable();
    t.bigInteger("expires_at").notNullable();
    t.timestamps(true, true);

    t.index("expires_at");
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists("tailwinds");
};
