import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

const isProd = process.env.NODE_ENV === "production"; // Check if in development mode

createRoot(document.getElementById("root")).render(
  isProd ? (
    <App />
  ) : (
    <StrictMode>
      <App />
    </StrictMode>
  )
);
