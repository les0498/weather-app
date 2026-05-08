import type {
  ForecastResponse,
  OpenWeatherResponse,
  WeatherSummary,
  HourlyTemperature,
} from "../model/types";

const formatKoreaDate = (timestamp: number) => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(timestamp * 1000));
};

const formatKoreaTime = (timestamp: number) => {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(timestamp * 1000));
};

const getTodayForecastItems = (forecast: ForecastResponse) => {
  const today = formatKoreaDate(Date.now() / 1000);

  return forecast.list.filter((item) => formatKoreaDate(item.dt) === today);
};

const getTodayMinMax = (
  current: OpenWeatherResponse,
  forecast: ForecastResponse,
) => {
  const forecastTemps = getTodayForecastItems(forecast).map(
    (item) => item.main.temp,
  );

  const temps = [current.main.temp, ...forecastTemps];

  return {
    min: Math.min(...temps),
    max: Math.max(...temps),
  };
};

const getHourlyTemps = (forecast: ForecastResponse): HourlyTemperature[] => {
  return getTodayForecastItems(forecast).map((item) => {
    return {
      time: formatKoreaTime(item.dt),
      temp: Math.round(item.main.temp),
    };
  });
};

export const normalizeWeather = (
  current: OpenWeatherResponse,
  forecast: ForecastResponse,
): WeatherSummary => {
  const { min, max } = getTodayMinMax(current, forecast);

  return {
    locationName: current.name,
    currentTemp: Math.round(current.main.temp),
    minTemp: Math.round(min),
    maxTemp: Math.round(max),
    description: current.weather[0]?.description ?? "정보 없음",
    icon: current.weather[0]?.icon ?? "",
    hourlyTemps: getHourlyTemps(forecast),
  };
};
