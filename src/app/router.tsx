import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "@/pages/home";
import { WeatherDetailPage } from "@/pages/weather-detail";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/weather/:lat/:lon" element={<WeatherDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
