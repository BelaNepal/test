const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    // console.log("Decoded token payload:", decoded);  // <-- Add this line to debug
    req.user = decoded.user; // Attach decoded user info to request object
    next();
  });
}

module.exports = authenticateToken;
