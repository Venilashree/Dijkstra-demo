require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const routeRoutes = require("./routes/routeRoutes");

const app = express();

/* ─────────────────────────────────────────────
   PORT (Render injects this automatically)
───────────────────────────────────────────── */
const PORT = process.env.PORT || 5000;

/* ─────────────────────────────────────────────
   DATABASE CONNECTION
───────────────────────────────────────────── */
connectDB();

/* ─────────────────────────────────────────────
   MIDDLEWARE
───────────────────────────────────────────── */
app.use(
  cors({
    origin: "*", // you can lock this later to GitHub Pages URL
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ─────────────────────────────────────────────
   REQUEST LOGGER (helps debugging on Render)
───────────────────────────────────────────── */
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

/* ─────────────────────────────────────────────
   API ROUTES
───────────────────────────────────────────── */
app.use("/api/routes", routeRoutes);

/* ─────────────────────────────────────────────
   HEALTH CHECK (Render uses this often)
───────────────────────────────────────────── */
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server running perfectly 🚀",
    time: new Date().toISOString(),
  });
});

/* ─────────────────────────────────────────────
   OPTIONAL FRONTEND BUILD (future use)
───────────────────────────────────────────── */
/*
app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});
*/

/* ─────────────────────────────────────────────
  START SERVER
───────────────────────────────────────────── */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});