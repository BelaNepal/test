const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  try {
    const userExists = await pool.query("SELECT * FROM users WHERE username=$1", [username]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [username, hashed]);
    res.json({ message: "User registered" });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE username=$1", [username]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid username" });
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ user: user.username }, process.env.JWT_SECRET_KEY);
    res.json({ token });
  } catch (err) {
    console.error("Login error:", err); // Backend logs

  if (err.code === 'ECONNREFUSED') {
    return res.status(500).json({ error: "Cannot connect to database." });
  }
  
  console.error("Login error:", err.message || err);
  return res.status(500).json({ error: "Login service temporarily unavailable. Please try again later." });
  }

});
router.get("/test-login", async (req, res) => {
  try {
    const user = {
      username: "db",
      password: "$2a$10$..." // use actual hashed value from DB
    };
    const isValid = await bcrypt.compare("db", user.password);
    if (!isValid) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ user: user.username }, process.env.JWT_SECRET_KEY);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
