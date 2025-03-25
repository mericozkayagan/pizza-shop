const { Pool } = require("pg");
require("dotenv").config();

// Create a new Pool using the connection string from .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  console.log("Connected to PostgreSQL database");
  release();
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
