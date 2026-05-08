import type { OpenWeatherResponse } from "../model/types";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const BASE_URL = "https://api.openweathermap.org/data/2.5";

export const getCurrentWeather = async (
  lat: number,
  lon: number,
): Promise<OpenWeatherResponse> => {
  const res = await fetch(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`,
  );

  if (!res.ok) {
    throw new Error("날씨 데이터를 가져오는데 실패함");
  }

  return res.json();
};
