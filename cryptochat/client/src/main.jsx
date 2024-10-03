import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Auth } from "./Auth.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Auth>
      <App />
    </Auth>
  </StrictMode>,
);
