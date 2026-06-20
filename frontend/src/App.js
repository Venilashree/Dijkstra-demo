import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import AddRoute from "./components/AddRoute";
import RoutesView from "./components/RoutesView";
import Simulation from "./components/Simulation";

// ✅ FORCE ONLY RENDER BACKEND (NO LOCALHOST EVER)
const API_BASE_URL = "https://dijkstra-demo-1.onrender.com";

function App() {
  const [page, setPage] = useState("home");
  const [routes, setRoutes] = useState([]);

  // ── FETCH ROUTES ─────────────────────────────
  useEffect(() => {
    let isMounted = true;

    const fetchRoutes = async () => {
      try {
        console.log("🌐 Fetching from:", API_BASE_URL);

        const res = await fetch(`${API_BASE_URL}/api/routes`);
        const data = await res.json();

        console.log("🔥 Routes received:", data);

        if (isMounted && data.success) {
          setRoutes(data.routes);
        }
      } catch (err) {
        console.error("❌ Fetch error:", err);
      }
    };

    fetchRoutes();

    const interval = setInterval(fetchRoutes, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <Navbar page={page} setPage={setPage} />

      {page === "home" && <Home setPage={setPage} />}

      {page === "add" && (
        <AddRoute routes={routes} setRoutes={setRoutes} />
      )}

      {page === "routes" && (
        <RoutesView routes={routes} setRoutes={setRoutes} />
      )}

      {page === "sim" && <Simulation routes={routes} />}
    </>
  );
}

export default App;