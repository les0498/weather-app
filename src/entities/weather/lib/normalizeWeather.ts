import type {
  ForecastResponse,
  OpenWeatherResponse,
  WeatherSummary,
  HourlyTemperature,
} from "../model/types";

const FORECAST_ITEM_COUNT_FOR_24_HOURS = 8;

const formatKoreaClockTime = (timestamp: number) => {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(timestamp * 1000));
};

const getNext24HourForecastItems = (forecast: ForecastResponse) => {
  return forecast.list.slice(0, FORECAST_ITEM_COUNT_FOR_24_HOURS);
};

const getNext24HourMinMax = (
  current: OpenWeatherResponse,
  forecast: ForecastResponse,
) => {
  const forecastTemps = getNext24HourForecastItems(forecast).map(
    (item) => item.main.temp,
  );

  const temps = [current.main.temp, ...forecastTemps];

  return {
    min: Math.min(...temps),
    max: Math.max(...temps),
  };
};

const getHourlyTemps = (forecast: ForecastResponse): HourlyTemperature[] => {
  return getNext24HourForecastItems(forecast).map((item) => {
    const weather = item.weather[0];
    return {
      time: formatKoreaClockTime(item.dt),
      temp: Math.round(item.main.temp),
      icon: weather?.icon ?? "",
      description: weather?.description ?? "정보 없음",
    };
  });
};

export const normalizeWeather = (
  current: OpenWeatherResponse,
  forecast: ForecastResponse,
): WeatherSummary => {
  const { min, max } = getNext24HourMinMax(current, forecast);

  return {
    locationName: current.name,

    currentTemp: Math.round(current.main.temp),

    minTemp: Math.round(min),

    maxTemp: Math.round(max),

    description: current.weather[0]?.description ?? "정보 없음",

    icon: current.weather[0]?.icon ?? "",

    hourlyTemps: getHourlyTemps(forecast),

    feelsLike: Math.round(current.main.feels_like),

    humidity: current.main.humidity,

    pressure: current.main.pressure,

    windSpeed: current.wind.speed,

    sunrise: formatKoreaClockTime(current.sys.sunrise),

    sunset: formatKoreaClockTime(current.sys.sunset),
  };
};
