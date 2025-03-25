const bcrypt = require("bcrypt");
const { Pool } = require("pg");
require("dotenv").config();

const createUser = async () => {
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("123123", salt);

    // Insert the new user
    const result = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
      ["Meric", "meric@gmail.com", hashedPassword, "admin"]
    );

    console.log("User created successfully:", result.rows[0]);
    await pool.end();
  } catch (error) {
    console.error("Error creating user:", error);
    process.exit(1);
  }
};

createUser();
