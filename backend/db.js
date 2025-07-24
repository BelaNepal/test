const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER || "your_db_user",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "your_db_name",
  password: process.env.DB_PASSWORD || "your_db_password",
  port: process.env.DB_PORT || 5432,
});

pool.connect((err) => {
  if (err) {
    console.error("Failed to connect to DB:", err);
  } else {
    console.log("Connected to PostgreSQL database!");
  }
});

module.exports = pool;
