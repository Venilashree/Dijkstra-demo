import React from "react";
import { API_BASE_URL } from "../config";


function RoutesView({ routes, setRoutes }) {

  async function deleteRoute(id) {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/routes/${id}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (data.success) {
        setRoutes(prev => prev.filter(r => r._id !== id));
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function editRoute(id) {
    const current = routes.find(r => r._id === id);
    if (!current) return;

    const from = prompt("From", current.from);
    const to = prompt("To", current.to);
    const distance = prompt("Distance", current.distance);

    if (!from || !to || !distance) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/routes/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            from,
            to,
            distance: Number(distance),
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setRoutes(prev =>
          prev.map(r => (r._id === id ? data.route : r))
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function clearAll() {
    if (!window.confirm("Delete all?")) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/routes`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (data.success) setRoutes([]);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <h2>Routes</h2>

      <button onClick={clearAll}>Clear All</button>

      {routes.map(r => (
        <div key={r._id}>
          {r.from} → {r.to} ({r.distance} km)

          <button onClick={() => editRoute(r._id)}>Edit</button>
          <button onClick={() => deleteRoute(r._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default RoutesView;