const { Pool } = require("pg");
const ENV = process.env.NODE_ENV === "test" ? "test" : "development";

require("dotenv").config({ path: `${__dirname}/../.env.${ENV}` });

if (!process.env.PGDATABASE) {
  throw new Error("PGDATABASE not set!");
} else {
  console.log(`PGDATABASE set as ${process.env.PGDATABASE}`);
}

const db = new Pool();
module.exports = db;
