import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryProvider } from "./app/providers/QueryProvider";
import { Router } from "./app/router";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <Router />
    </QueryProvider>
  </StrictMode>,
);
