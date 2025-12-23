import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css";
import "./styles/components.css";
import { seedDummyCards } from "./utils/seedDummyCards";
import { getBoardState } from "./services/storage";

// Seed dummy cards if nothing persisted
const persisted = getBoardState();
if (!persisted) {
  seedDummyCards(5, 100); // 5 lists x 100 cards = 500 cards
}

// Start MSW only in DEV
if (import.meta.env.DEV) {
  (async () => {
    try {
      const { worker } = await import("./mocks/browser.js");
      await worker.start({ onUnhandledRequest: "bypass" });
      console.log("✅ MSW worker started");
    } catch (err) {
      console.error("❌ Failed to start MSW worker:", err);
    }
  })();
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
