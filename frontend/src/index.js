// ─────────────────────────────────────────────────────────────
//  index.js  —  Entry point of the React app
//
//  This file tells React:
//    1. Find the <div id="root"> in index.html
//    2. Render our <App /> component inside it
//    3. Import the global CSS styles
// ─────────────────────────────────────────────────────────────

import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";   // global styles applied to whole app
import App from "./App"; // our root component

// createRoot() is the modern React 18 way to mount the app
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    {/*
      StrictMode helps catch bugs during development.
      It runs checks twice in dev mode but not in production.
    */}
    <App />
  </React.StrictMode>
);