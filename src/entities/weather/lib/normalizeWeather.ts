import type {
  ForecastResponse,
  OpenWeatherResponse,
  WeatherSummary,
  HourlyTemperature,
} from "../model/types";

const getKoreaDateString = () => {
  const now = new Date();

  const koreaNow = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }),
  );

  const year = koreaNow.getFullYear();
  const month = String(koreaNow.getMonth() + 1).padStart(2, "0");
  const date = String(koreaNow.getDate()).padStart(2, "0");

  return `${year}-${month}-${date}`;
};

const getTodayForecastItems = (forecast: ForecastResponse) => {
  const today = getKoreaDateString();

  return forecast.list.filter((item) => item.dt_txt.startsWith(today));
};

const getTodayMinMax = (
  current: OpenWeatherResponse,
  forecast: ForecastResponse,
) => {
  const today = getKoreaDateString();

  const forecastTemps = forecast.list
    .filter((item) => item.dt_txt.startsWith(today))
    .map((item) => item.main.temp);

  const temps = [current.main.temp, ...forecastTemps];
  return {
    min: Math.min(...temps),
    max: Math.max(...temps),
  };
};

const getHourlyTemps = (forecast: ForecastResponse): HourlyTemperature[] => {
  const todayItems = getTodayForecastItems(forecast);

  return todayItems.map((item) => {
    const time = item.dt_txt.split(" ")[1].slice(0, 5);

    return {
      time,
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
