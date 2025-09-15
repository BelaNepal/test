require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const protectedRoutes = require("./routes/protected");
const formRoutes = require("./routes/form");
const documentRoutes = require("./routes/documents");

const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// CORS setup
app.use(cors({
  origin: "http://192.168.1.97:3000", // your frontend dev origin
  methods: ["POST", "GET"],
  allowedHeaders: ["Content-Type"],
}));

// JSON parser (not used for multipart, but good for other routes)
app.use(express.json());

// Route mounting
app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api", formRoutes);
app.use("/api/documents", documentRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Global error:", err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running at http://localhost:${PORT}`);
});
