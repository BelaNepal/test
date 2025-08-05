require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const protectedRoutes = require("./routes/protected"); // <== new

const formRoute = require("./routes/form");
const documentRoutes = require("./routes/documents");

const app = express();

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes); // <== protect routes here
app.use("/api", formRoute);
app.use("/api/documents", documentRoutes);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
