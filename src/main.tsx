import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";

import { App } from "./App";
import { QueryProvider } from "./app/providers/QueryProvider";
import { WeatherDetailPage } from "./pages/WeatherDetailPage";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/weather/:lat/:lon" element={<WeatherDetailPage />} />
        </Routes>
      </BrowserRouter>
    </QueryProvider>
  </React.StrictMode>,
);
