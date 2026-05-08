import type { OpenWeatherResponse, WeatherSummary } from "../model/types";

export const normalizeWeather = (data: OpenWeatherResponse): WeatherSummary => {
  return {
    locationName: data.name,
    currentTemp: Math.round(data.main.temp),
    minTemp: Math.round(data.main.temp_min),
    maxTemp: Math.round(data.main.temp_max),
    description: data.weather[0]?.description ?? "정보 없음",
    icon: data.weather[0]?.icon ?? "",
  };
};
