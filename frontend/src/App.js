// ─────────────────────────────────────────────────────────────
//  App.js  —  Root Component
//
//  WHAT THIS FILE DOES:
//    • Holds the global state: which page is active + all routes
//    • Fetches routes from MongoDB backend
//    • Passes routes + setRoutes to child components
//    • Automatically refreshes routes every 3 seconds
//
//  CONCEPTS USED:
//    • useState
//    • useEffect
//    • Conditional Rendering
//    • State Lifting
//    • API Fetching
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";

import Navbar     from "./components/Navbar";
import Home       from "./components/Home";
import AddRoute   from "./components/AddRoute";
import RoutesView from "./components/RoutesView";
import Simulation from "./components/Simulation";

function App() {

  // ── Active Page State ────────────────────────────────────
  // Possible values:
  // "home" | "add" | "routes" | "sim"
  const [page, setPage] = useState("home");

  // ── Global Routes State ──────────────────────────────────
  // Shared across AddRoute, RoutesView, Simulation
  const [routes, setRoutes] = useState([]);

  // ── Fetch Routes From Backend ────────────────────────────
  useEffect(() => {

    // Function to fetch routes
    async function fetchRoutes() {

      try {

        const res = await fetch("http://localhost:5000/api/routes");

        const data = await res.json();

        console.log("🔥 FRONTEND RECEIVED:", data);

        if (data.success) {
          setRoutes(data.routes);
        }

      } catch (err) {

        console.error("❌ FETCH ERROR:", err);

      }
    }

    // Initial fetch when app loads
    fetchRoutes();

    // Auto refresh every 3 seconds
    const interval = setInterval(fetchRoutes, 3000);

    // Cleanup interval when component unmounts
    return () => clearInterval(interval);

  }, []);

  // ── Render ───────────────────────────────────────────────
  return (
    <>

      {/* ── Navbar ─────────────────────────────────────── */}
      <Navbar page={page} setPage={setPage} />

      {/* ── Conditional Page Rendering ────────────────── */}

      {page === "home" && (
        <Home setPage={setPage} />
      )}

      {page === "add" && (
        <AddRoute
          routes={routes}
          setRoutes={setRoutes}
        />
      )}

      {page === "routes" && (
        <RoutesView
          routes={routes}
          setRoutes={setRoutes}
        />
      )}

      {page === "sim" && (
        <Simulation
          routes={routes}
        />
      )}

    </>
  );
}

export default App;