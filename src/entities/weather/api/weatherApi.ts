import type {
  OpenWeatherResponse,
  GeocodingResponse,
  ForecastResponse,
} from "../model/types";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_BASE_URL = "https://api.openweathermap.org/geo/1.0";

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

export const getForecast = async (
  lat: number,
  lon: number,
): Promise<ForecastResponse> => {
  const res = await fetch(
    `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`,
  );

  if (!res.ok) {
    throw new Error("예보 데이터를 가져오는데 실패함");
  }

  return res.json();
};

export const getCoordinatesByPlaceName = async (
  placeName: string,
): Promise<GeocodingResponse> => {
  const res = await fetch(
    `${GEO_BASE_URL}/direct?q=${encodeURIComponent(placeName)},KR&limit=1&appid=${API_KEY}`,
  );

  if (!res.ok) {
    throw new Error("장소 좌표를 가져오는데 실패함");
  }

  return res.json();
};
