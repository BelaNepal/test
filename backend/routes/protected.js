const express = require("express");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

router.get("/dashboard", authenticateToken, (req, res) => {
  // Assuming req.user is an object like { user: "username" }
  // If req.user is a string, use it directly, else try to access .user property
  const username = typeof req.user === "string" ? req.user : "User"; // adjust based on your token payload structure

  res.json({
    message: `Welcome, ${username}! This is from backend.`,
    user: username,
  });
});

module.exports = router;
