import React from "react";
import ReactDOM from "react-dom/client";
import "@shared/styles/globals.css";
import App from "@app/App";
import { lockStableViewportHeight } from "@shared/lib/viewport";

lockStableViewportHeight();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
