// const { Pool } = require("pg");

// const path = `${__dirname}/.env`;

// require("dotenv").config({ path });

// if (!process.env.PGDATABASE) {
//   throw new Error("PGDATABASE not set");
// }
// const pool = new Pool();

// module.exports = pool;

const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "test";
const config = {};

require("dotenv").config({
  path: `${__dirname}/.env.${ENV}`,
});

console.log(process.env.DATABASE_URL);
if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}

const pool = new Pool(config);
function createBlogs() {
  return pool.query(
    `CREATE TABLE blogs (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      author VARCHAR(255) NOT NULL,
      date DATE NOT NULL,
      content TEXT NOT NULL,
      img_url VARCHAR(255) NOT NULL
    );`
  );
}

module.exports = pool;
