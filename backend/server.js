require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const routeRoutes = require("./routes/routeRoutes");

const app = express();

const PORT = process.env.PORT || 5000;
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

/* Middleware */
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

/* Routes */
app.use("/api/routes", routeRoutes);

/* Health check */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Dijkstra API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, status: "ok" });
});

/* ─────────────────────────────
   IMPORTANT FIX HERE
───────────────────────────── */
async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ Server startup failed:", err.message);
    process.exit(1);
  }
}

startServer();
