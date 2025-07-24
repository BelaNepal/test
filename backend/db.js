const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "db.your-project-ref.supabase.co", // Not localhost!
  database: process.env.DB_NAME || "your_db_name",
  password: process.env.DB_PASSWORD || "your_db_password",
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false // Required for Supabase
  }
});

pool.connect((err) => {
  if (err) {
    console.error("❌ DB connection failed:", err.message || err);
  } else {
    console.log("✅ Connected to Supabase PostgreSQL!");
  }
});

module.exports = pool;
