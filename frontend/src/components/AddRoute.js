import React, { useState, useRef, useEffect } from "react";
import { getAllNodes, computeLayout } from "../utils/dijkstra";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "https://dijkstra-demo-1.onrender.com";

function AddRoute({ routes, setRoutes }) {
  const [srcNode, setSrcNode] = useState("");
  const [dstNode, setDstNode] = useState("");
  const [numRoutes, setNumRoutes] = useState("");
  const [rows, setRows] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const canvasRef = useRef(null);

  function handleGenerate() {
    const n = parseInt(numRoutes);

    if (!srcNode || !dstNode || !n || n < 1) {
      alert("Please fill Source, Destination and Number of Routes.");
      return;
    }

    const generated = Array.from({ length: n }, (_, i) => ({
      from: i === 0 ? srcNode : "",
      to: i === n - 1 ? dstNode : "",
      distance: "",
    }));

    setRows(generated);
  }

  function updateRow(index, field, value) {
    setRows(prev =>
      prev.map((r, i) =>
        i === index ? { ...r, [field]: value } : r
      )
    );
  }

  function deleteRow(index) {
    setRows(prev => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    const valid = rows
      .filter(r => r.from && r.to && parseFloat(r.distance) > 0)
      .map(r => ({
        from: r.from.trim(),
        to: r.to.trim(),
        distance: Number(r.distance),
      }));

    if (!valid.length) {
      alert("Fill at least one valid route");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/routes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ routes: valid }),
      });

      const data = await res.json();

      if (data.success) {
        setRoutes(prev => [...prev, ...data.routes]);
        setRows([]);
        setSrcNode("");
        setDstNode("");
        setNumRoutes("");
        setShowSuccess(true);
      } else {
        alert("Failed to save routes");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  }

  return (
    <div className="page">
      <h2>➕ Add Route</h2>

      <input
        placeholder="Source"
        value={srcNode}
        onChange={e => setSrcNode(e.target.value)}
      />

      <input
        placeholder="Destination"
        value={dstNode}
        onChange={e => setDstNode(e.target.value)}
      />

      <input
        type="number"
        placeholder="Number of routes"
        value={numRoutes}
        onChange={e => setNumRoutes(e.target.value)}
      />

      <button onClick={handleGenerate}>Generate</button>

      {rows.map((r, i) => (
        <div key={i}>
          <input
            placeholder="From"
            value={r.from}
            onChange={e => updateRow(i, "from", e.target.value)}
          />

          <input
            placeholder="To"
            value={r.to}
            onChange={e => updateRow(i, "to", e.target.value)}
          />

          <input
            placeholder="Distance"
            value={r.distance}
            onChange={e => updateRow(i, "distance", e.target.value)}
          />

          <button onClick={() => deleteRow(i)}>X</button>
        </div>
      ))}

      <button onClick={handleSubmit}>Save Routes</button>

      {showSuccess && <p>✅ Saved!</p>}
    </div>
  );
}

export default AddRoute;