const express = require("express");
const router = express.Router();
const Route = require("../models/Route");

/* ─────────────────────────────────────────────
   DIJKSTRA ALGORITHM (UNCHANGED - GOOD LOGIC)
───────────────────────────────────────────── */
function dijkstra(routes, source, destination) {
  const graph = {};

  routes.forEach(({ from, to, distance }) => {
    if (!graph[from]) graph[from] = [];
    if (!graph[to]) graph[to] = [];

    graph[from].push({ node: to, weight: distance });
    graph[to].push({ node: from, weight: distance });
  });

  const nodes = [...new Set(routes.flatMap((r) => [r.from, r.to]))];

  const dist = {};
  const prev = {};
  const visited = new Set();
  const steps = [];

  nodes.forEach((n) => {
    dist[n] = Infinity;
    prev[n] = null;
  });

  dist[source] = 0;

  while (true) {
    let current = null;
    let min = Infinity;

    nodes.forEach((n) => {
      if (!visited.has(n) && dist[n] < min) {
        min = dist[n];
        current = n;
      }
    });

    if (!current || current === destination) break;

    visited.add(current);
    steps.push(`Visiting ${current} → cost ${dist[current]}`);

    (graph[current] || []).forEach(({ node, weight }) => {
      const newDist = dist[current] + weight;

      if (newDist < dist[node]) {
        dist[node] = newDist;
        prev[node] = current;
        steps.push(`✅ Updated ${node} → ${newDist}`);
      } else {
        steps.push(`❌ Skipped ${node}`);
      }
    });
  }

  const path = [];
  let node = destination;

  while (node) {
    path.unshift(node);
    node = prev[node];
  }

  return {
    path,
    distance: dist[destination],
    steps,
  };
}

/* ─────────────────────────────────────────────
   GET ALL ROUTES
───────────────────────────────────────────── */
router.get("/", async (req, res) => {
  try {
    const routes = await Route.find().sort({ createdAt: 1 });

    return res.json({
      success: true,
      count: routes.length,
      routes,
    });
  } catch (err) {
    console.error("GET /routes error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch routes",
    });
  }
});

/* ─────────────────────────────────────────────
   CREATE ROUTES
───────────────────────────────────────────── */
router.post("/", async (req, res) => {
  try {
    let routes = req.body.routes;

    if (!Array.isArray(routes)) {
      routes = [req.body];
    }

    const saved = await Route.insertMany(routes);

    return res.status(201).json({
      success: true,
      count: saved.length,
      routes: saved,
    });
  } catch (err) {
    console.error("POST /routes error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create routes",
    });
  }
});

/* ─────────────────────────────────────────────
   UPDATE ROUTE
───────────────────────────────────────────── */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Route.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    return res.json({
      success: true,
      route: updated,
    });
  } catch (err) {
    console.error("PUT /routes error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
});

/* ─────────────────────────────────────────────
   DELETE ROUTE
───────────────────────────────────────────── */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Route.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    return res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (err) {
    console.error("DELETE /routes error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
});

/* ─────────────────────────────────────────────
   CLEAR ALL ROUTES
───────────────────────────────────────────── */
router.delete("/", async (req, res) => {
  try {
    const result = await Route.deleteMany({});

    return res.json({
      success: true,
      message: `${result.deletedCount} routes deleted`,
    });
  } catch (err) {
    console.error("CLEAR routes error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Bulk delete failed",
    });
  }
});

/* ─────────────────────────────────────────────
   NODES
───────────────────────────────────────────── */
router.get("/nodes", async (req, res) => {
  try {
    const routes = await Route.find({}, "from to");
    const nodes = [...new Set(routes.flatMap((r) => [r.from, r.to]))];

    return res.json({
      success: true,
      nodes,
    });
  } catch (err) {
    console.error("NODES error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch nodes",
    });
  }
});

/* ─────────────────────────────────────────────
   STATS
───────────────────────────────────────────── */
router.get("/stats", async (req, res) => {
  try {
    const routes = await Route.find();

    const nodes = [...new Set(routes.flatMap((r) => [r.from, r.to]))];

    const totalDistance = routes.reduce((sum, r) => sum + r.distance, 0);

    return res.json({
      success: true,
      stats: {
        totalRoutes: routes.length,
        totalNodes: nodes.length,
        totalDistance,
      },
    });
  } catch (err) {
    console.error("STATS error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Stats calculation failed",
    });
  }
});

/* ─────────────────────────────────────────────
   SHORTEST PATH
───────────────────────────────────────────── */
router.post("/shortest-path", async (req, res) => {
  try {
    const { source, destination } = req.body;

    if (!source || !destination) {
      return res.status(400).json({
        success: false,
        message: "Source and destination required",
      });
    }

    const routes = await Route.find();
    const nodes = [...new Set(routes.flatMap((r) => [r.from, r.to]))];

    if (!nodes.includes(source) || !nodes.includes(destination)) {
      return res.status(404).json({
        success: false,
        message: "Invalid source or destination",
      });
    }

    const result = dijkstra(routes, source, destination);

    return res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    console.error("SHORTEST PATH error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Path calculation failed",
    });
  }
});

module.exports = router;