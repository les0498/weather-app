import { useQuery } from "@tanstack/react-query";
import { getCurrentWeather, getForecast } from "../api/weatherApi";
import { normalizeWeather } from "../lib/normalizeWeather";

export const useWeatherQuery = (lat?: number, lon?: number) => {
  return useQuery({
    queryKey: ["weather", lat, lon],
    queryFn: async () => {
      const [current, forecast] = await Promise.all([
        getCurrentWeather(lat!, lon!),
        getForecast(lat!, lon!),
      ]);

      return normalizeWeather(current, forecast);
    },
    enabled: !!lat && !!lon,
  });
};
